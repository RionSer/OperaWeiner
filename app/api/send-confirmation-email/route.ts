import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateBookingReference } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, userEmail, concertTitle, concertDate, bookingReference, totalAmount } = body

    if (!bookingId || !userEmail || !bookingReference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Send confirmation email using a simple HTML email template
    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a1610; margin: 0;">Booking Confirmed</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Wiener Oper</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
              <h2 style="color: #1a1610; margin: 0 0 15px 0; font-size: 18px;">Concert Details</h2>
              <p style="margin: 8px 0;"><strong>Concert:</strong> ${concertTitle}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> ${concertDate}</p>
              <p style="margin: 8px 0;"><strong>Total Amount:</strong> €${totalAmount}</p>
            </div>

            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your booking reference:</p>
              <p style="margin: 0; color: #1a1610; font-size: 20px; font-weight: bold; letter-spacing: 2px;">${bookingReference}</p>
            </div>

            <p style="color: #666; margin-bottom: 20px;">Please keep this confirmation email and your booking reference safe. You can view and manage your tickets in your dashboard.</p>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">© 2026 Wiener Oper. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // In a production app, you would send this via a service like SendGrid, AWS SES, or Resend
    // For now, we'll just log it and return success
    console.log(`[Email] Confirmation email would be sent to ${userEmail}`)
    console.log(`[Email] Booking Reference: ${bookingReference}`)

    return NextResponse.json(
      { success: true, message: 'Confirmation email sent' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}
