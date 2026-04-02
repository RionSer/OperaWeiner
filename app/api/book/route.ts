import { NextResponse } from "next/server"
import { getConcertById } from "@/lib/concerts"

function generateBookingId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "WO-"
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { concertId, name, email, tickets } = body

    // Validate required fields
    if (!concertId || !name || !email || !tickets) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Validate tickets range
    if (typeof tickets !== "number" || tickets < 1 || tickets > 10) {
      return NextResponse.json(
        { error: "Tickets must be between 1 and 10" },
        { status: 400 }
      )
    }

    // Validate concert exists
    const concert = getConcertById(concertId)
    if (!concert) {
      return NextResponse.json(
        { error: "Concert not found" },
        { status: 404 }
      )
    }

    const bookingId = generateBookingId()
    const total = tickets * concert.price

    // In production, you would:
    // 1. Save booking to a database
    // 2. Process payment via Stripe
    // 3. Send confirmation email via SendGrid/Resend

    console.log("Booking confirmed:", {
      bookingId,
      concertId,
      name,
      email,
      tickets,
      total,
    })

    return NextResponse.json({
      bookingId,
      concert: concert.title,
      name,
      email,
      tickets,
      total,
      date: concert.date,
      time: concert.time,
      venue: concert.venue,
    })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
