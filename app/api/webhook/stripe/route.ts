import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!endpointSecret || !sig) {
    return NextResponse.json(
      { error: 'Missing webhook secret or signature' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const bookingId = session.metadata?.bookingId as string | undefined
      const bookingRef = session.metadata?.booking_reference as string | undefined
      const sessionId = session.id

      if (!bookingId && !bookingRef) {
        return NextResponse.json(
          { error: 'No booking id or booking_reference in session metadata' },
          { status: 400 }
        )
      }

      const updatePayload = {
        stripe_session_id: sessionId,
        stripe_payment_intent_id: session.payment_intent,
        payment_status: 'completed' as const,
      }

      let query = supabase.from('bookings').update(updatePayload)
      if (bookingId) {
        query = query.eq('id', bookingId)
      } else {
        query = query.eq('booking_reference', bookingRef!)
      }

      const { error } = await query.select()

      if (error) {
        console.error('Error updating booking:', error)
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
      }

      console.log(
        `[Webhook] Booking payment completed (${bookingId ? `id=${bookingId}` : `ref=${bookingRef}`})`
      )
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as any
      const bookingId = session.metadata?.bookingId as string | undefined
      const bookingRef = session.metadata?.booking_reference as string | undefined

      if (!bookingId && !bookingRef) {
        return NextResponse.json(
          { error: 'No booking id or booking_reference in session metadata' },
          { status: 400 }
        )
      }

      let query = supabase.from('bookings').update({ payment_status: 'expired' })
      if (bookingId) {
        query = query.eq('id', bookingId)
      } else {
        query = query.eq('booking_reference', bookingRef!)
      }

      const { error } = await query

      if (error) {
        console.error('Error updating booking:', error)
      }

      console.log(
        `[Webhook] Booking checkout expired (${bookingId ? `id=${bookingId}` : `ref=${bookingRef}`})`
      )
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as any
      console.log(`[Webhook] Payment failed for intent ${paymentIntent.id}`)
      break
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
