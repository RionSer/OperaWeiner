import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

/** Stripe lowercases metadata keys; payment_intent may be id string or expanded object */
function bookingIdFromMetadata(metadata: Record<string, string> | null | undefined): string | undefined {
  if (!metadata) return undefined
  const id = metadata.booking_id || metadata.bookingid
  return id?.trim() || undefined
}

function paymentIntentId(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in (value as object)) {
    const id = (value as { id?: string }).id
    return typeof id === 'string' ? id : null
  }
  return null
}

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
      const meta = session.metadata as Record<string, string> | undefined
      const bookingId = bookingIdFromMetadata(meta)
      const bookingRef = meta?.booking_reference?.trim() || undefined
      const sessionId = session.id

      if (!bookingId && !bookingRef) {
        console.error('[Webhook] checkout.session.completed missing metadata', {
          sessionId,
          metadataKeys: meta ? Object.keys(meta) : [],
        })
        return NextResponse.json(
          { error: 'No booking id or booking_reference in session metadata' },
          { status: 400 }
        )
      }

      const piId = paymentIntentId(session.payment_intent)

      const updatePayload = {
        stripe_session_id: sessionId,
        ...(piId ? { stripe_payment_intent_id: piId } : {}),
        payment_status: 'completed' as const,
      }

      let query = supabase.from('bookings').update(updatePayload)
      if (bookingId) {
        query = query.eq('id', bookingId)
      } else {
        query = query.eq('booking_reference', bookingRef!)
      }

      const { data: updatedRows, error } = await query.select('id')

      if (error) {
        console.error('[Webhook] Error updating booking:', error)
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
      }

      if (!updatedRows?.length) {
        console.error('[Webhook] No booking row matched update', {
          sessionId,
          bookingId,
          bookingRef,
        })
        return NextResponse.json(
          { error: 'No matching booking row' },
          { status: 500 }
        )
      }

      console.log(
        `[Webhook] Booking payment completed (${bookingId ? `id=${bookingId}` : `ref=${bookingRef}`})`
      )
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as any
      const meta = session.metadata as Record<string, string> | undefined
      const bookingId = bookingIdFromMetadata(meta)
      const bookingRef = meta?.booking_reference?.trim() || undefined

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
