"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getConcertById } from "@/lib/concerts"
import { redirect } from "next/navigation"

function generateBookingReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "WO-"
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

interface CheckoutInput {
  concertId: string
  tickets: number
}

export async function createCheckoutSession(input: CheckoutInput) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const concert = getConcertById(input.concertId)
  if (!concert) {
    throw new Error("Concert not found")
  }

  const tickets = Math.min(Math.max(1, input.tickets), 10)
  const totalAmount = concert.price * tickets
  const bookingReference = generateBookingReference()

  // Create booking record with pending status
  const { error: bookingError } = await supabase.from("bookings").insert({
    user_id: user.id,
    concert_id: concert.id,
    concert_title: concert.title,
    concert_composer: concert.composer,
    concert_venue: concert.venue,
    concert_date: concert.date,
    concert_time: concert.time,
    tickets: tickets,
    total_amount: totalAmount,
    payment_status: "pending",
    booking_reference: bookingReference,
  })

  if (bookingError) {
    console.error("Failed to create booking:", bookingError)
    throw new Error("Failed to create booking")
  }

  // Create Stripe checkout session
  console.log("Creating Stripe session with amount:", totalAmount, "cents:", Math.round(concert.price * 100))
  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: concert.title,
              description: `${concert.composer} at ${concert.venue} - ${concert.date} at ${concert.time}`,
            },
            unit_amount: Math.round(concert.price * 100), // Convert to cents
          },
          quantity: tickets,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://operatickets.netlify.app/dashboard"}/checkout/success?session_id={CHECKOUT_SESSION_ID}&booking_ref=${bookingReference}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://operatickets.netlify.app/"}/concerts/${concert.id}`,
      metadata: {
        booking_reference: bookingReference,
        user_id: user.id,
        concert_id: concert.id,
      },
    })
    console.log("Stripe session created successfully:", session.id)
  } catch (stripeError) {
    console.error("Stripe session creation failed:", stripeError)
    throw new Error(`Failed to create Stripe session: ${stripeError instanceof Error ? stripeError.message : String(stripeError)}`)
  }

  // Update booking with Stripe session ID
  await supabase
    .from("bookings")
    .update({ stripe_session_id: session.id })
    .eq("booking_reference", bookingReference)

  if (!session.url) {
    console.error("Stripe session created without url", session)
    throw new Error("Stripe checkout URL is not available")
  }

  return { checkoutUrl: session.url }
}
