import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type TicketData = {
  concertTitle: string
  concertComposer: string
  venue: string
  date: string
  time: string
  tickets: number
  bookingReference: string
  totalAmount: string
  fullName: string
  email: string
  bookingDate: string
}

function buildTicketHtml(data: {
  concertTitle: string
  concertComposer: string
  venue: string
  date: string
  time: string
  tickets: number
  bookingReference: string
  totalAmount: string
  fullName: string
  email: string
  bookingDate: string
}) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(data.bookingReference)}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Wiener Oper E-Ticket</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#0e0e0e;padding:16px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:bold;">
                    Wiener Oper
                  </td>
                  <td align="right" style="color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:12px;">
                    E-Ticket
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Concert Title -->
          <tr>
            <td style="padding:28px 24px 4px 24px;">
              <p style="margin:0;font-family:'Times New Roman',Times,serif;font-size:28px;font-weight:bold;color:#141414;">
                ${escapeHtml(data.concertTitle)}
              </p>
            </td>
          </tr>

          <!-- Composer -->
          <tr>
            <td style="padding:4px 24px 20px 24px;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#646464;">
                ${escapeHtml(data.concertComposer)}
              </p>
            </td>
          </tr>

          <!-- Info Grid -->
          <tr>
            <td style="padding:0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="8">
                <tr>
                  <td width="50%" style="background-color:#f1f1f1;padding:10px 14px;border-radius:4px;">
                    <p style="margin:0 0 2px 0;font-size:10px;color:#6e6e6e;font-family:Helvetica,Arial,sans-serif;">Venue</p>
                    <p style="margin:0;font-size:14px;color:#1e1e1e;font-weight:500;font-family:Helvetica,Arial,sans-serif;">${escapeHtml(data.venue)}</p>
                  </td>
                  <td width="50%" style="background-color:#f1f1f1;padding:10px 14px;border-radius:4px;">
                    <p style="margin:0 0 2px 0;font-size:10px;color:#6e6e6e;font-family:Helvetica,Arial,sans-serif;">Date</p>
                    <p style="margin:0;font-size:14px;color:#1e1e1e;font-weight:500;font-family:Helvetica,Arial,sans-serif;">${escapeHtml(data.date)}</p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="background-color:#f1f1f1;padding:10px 14px;border-radius:4px;">
                    <p style="margin:0 0 2px 0;font-size:10px;color:#6e6e6e;font-family:Helvetica,Arial,sans-serif;">Time</p>
                    <p style="margin:0;font-size:14px;color:#1e1e1e;font-weight:500;font-family:Helvetica,Arial,sans-serif;">${escapeHtml(data.time)}</p>
                  </td>
                  <td width="50%" style="background-color:#f1f1f1;padding:10px 14px;border-radius:4px;">
                    <p style="margin:0 0 2px 0;font-size:10px;color:#6e6e6e;font-family:Helvetica,Arial,sans-serif;">Tickets</p>
                    <p style="margin:0;font-size:14px;color:#1e1e1e;font-weight:500;font-family:Helvetica,Arial,sans-serif;">${data.tickets} ${data.tickets === 1 ? "ticket" : "tickets"}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:16px 24px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
            </td>
          </tr>

          <!-- QR & Booking Info -->
          <tr>
            <td style="padding:0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="140" valign="top">
                    <div style="background-color:#f1f1f1;border:1px solid #e2e8f0;border-radius:6px;padding:8px;display:inline-block;">
                      <img src="${qrUrl}" alt="QR Code" width="120" height="120" style="display:block;border:0;" />
                    </div>
                  </td>
                  <td valign="top" style="padding-left:16px;">
                    <p style="margin:0 0 4px 0;font-size:12px;color:#6e6e6e;font-family:Helvetica,Arial,sans-serif;">Booking Reference</p>
                    <p style="margin:0 0 8px 0;font-size:18px;font-weight:bold;color:#855610;font-family:'Courier New',Courier,monospace;">${escapeHtml(data.bookingReference)}</p>
                    <p style="margin:0 0 16px 0;font-size:11px;color:#6e6e6e;font-family:Helvetica,Arial,sans-serif;">Booked on ${escapeHtml(data.bookingDate)}</p>
                    <p style="margin:0;font-size:24px;font-weight:bold;color:#050505;font-family:Helvetica,Arial,sans-serif;">${escapeHtml(data.totalAmount)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer Info -->
          <tr>
            <td style="padding:20px 24px 8px 24px;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#3c3c3c;font-family:Helvetica,Arial,sans-serif;">Name: ${escapeHtml(data.fullName)}</p>
              <p style="margin:0;font-size:11px;color:#3c3c3c;font-family:Helvetica,Arial,sans-serif;">Email: ${escapeHtml(data.email)}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px 24px 24px;">
              <p style="margin:0;font-size:10px;color:#686868;font-family:Helvetica,Arial,sans-serif;">
                Please present this ticket at the venue entrance. This ticket is non-transferable.
              </p>
            </td>
          </tr>

        </table>

        <!-- Sub-footer -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:16px 0;">
              <p style="margin:0;font-size:11px;color:#999;font-family:Helvetica,Arial,sans-serif;">
                &copy; ${new Date().getFullYear()} Wiener Oper. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function envFlag(name: string): boolean | undefined {
  const v = process.env[name]
  if (v == null) return undefined
  if (["1", "true", "yes", "on"].includes(v.toLowerCase())) return true
  if (["0", "false", "no", "off"].includes(v.toLowerCase())) return false
  return undefined
}

function sanitizeForLog(value: unknown) {
  if (typeof value === "string") return value
  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return String(value)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, ticketData } = body as { to?: string; ticketData?: TicketData }

    if (!to || !emailRegex.test(to)) {
      return NextResponse.json({ error: "Invalid recipient email" }, { status: 400 })
    }

    if (!ticketData) {
      return NextResponse.json({ error: "Missing ticket data" }, { status: 400 })
    }

    const smtpUser = process.env.EMAIL_USER
    const smtpPass = process.env.EMAIL_APP_PASSWORD
    const smtpHost = process.env.EMAIL_HOST
    const smtpPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined
    const smtpSecure = envFlag("EMAIL_SECURE")
    const smtpService = process.env.EMAIL_SERVICE
    const from = process.env.EMAIL_FROM || (smtpUser ? `"Wiener Oper" <${smtpUser}>` : undefined)

    if (!smtpUser || !smtpPass) {
      console.error(
        "EMAIL_USER and EMAIL_APP_PASSWORD are not set in .env.local. " +
        "Email cannot be sent without real SMTP credentials."
      )
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service is not configured. Please set EMAIL_USER and EMAIL_APP_PASSWORD in .env.local.",
        },
        { status: 500 }
      )
    }

    if (!from) {
      return NextResponse.json(
        { success: false, error: "Email FROM address is not configured (EMAIL_FROM / EMAIL_USER)." },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport(
      smtpService
        ? {
            service: smtpService,
            auth: { user: smtpUser, pass: smtpPass },
          }
        : {
            // Prefer explicit SMTP settings when deploying (works beyond Gmail).
            host: smtpHost || "smtp.gmail.com",
            port: smtpPort ?? 465,
            secure: smtpSecure ?? (smtpPort ? smtpPort === 465 : true),
            auth: { user: smtpUser, pass: smtpPass },
          }
    )

    // Verify the connection before sending
    await transporter.verify()
    console.log("SMTP connection verified successfully", {
      host: smtpHost || (smtpService ? `service:${smtpService}` : "smtp.gmail.com"),
      port: smtpPort ?? 465,
      secure: smtpSecure ?? (smtpPort ? smtpPort === 465 : true),
      user: smtpUser,
    })

    const html = buildTicketHtml(ticketData)

    const info = await transporter.sendMail({
      from,
      to,
      subject: "Your Wiener Oper E-Ticket",
      text: `Your ticket for ${ticketData.concertTitle} — Booking Ref: ${ticketData.bookingReference}. Please check the HTML version of this email for the full ticket.`,
      html,
      headers: {
        "X-Booking-Reference": ticketData.bookingReference,
      },
    })

    const accepted = Array.isArray(info.accepted) ? info.accepted : []
    const rejected = Array.isArray(info.rejected) ? info.rejected : []
    const pending = Array.isArray((info as any).pending) ? (info as any).pending : []

    console.log("Email send result", {
      messageId: info.messageId,
      response: (info as any).response,
      envelope: sanitizeForLog((info as any).envelope),
      accepted,
      rejected,
      pending,
    })

    // If the SMTP server didn't accept it, don't return 200.
    if (rejected.length > 0 || pending.length > 0 || accepted.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Email was not accepted by the SMTP server.",
          details: { accepted, rejected, pending },
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, messageId: info.messageId })
  } catch (error: any) {
    console.error("Error sending email:", sanitizeForLog(error), {
      code: error?.code,
      response: error?.response,
      responseCode: error?.responseCode,
      command: error?.command,
    })

    let userMessage = "Unable to send email. Please try again later."
    if (error.code === "EAUTH") {
      userMessage = "Email authentication failed. Check EMAIL_USER and EMAIL_APP_PASSWORD."
    } else if (error.code === "ESOCKET" || error.code === "ECONNECTION") {
      userMessage = "Could not connect to email server. Check your network."
    } else if (error?.responseCode === 550 || error?.responseCode === 553) {
      userMessage = "Email was rejected by the SMTP server (invalid recipient or sending not permitted)."
    }

    return NextResponse.json({ success: false, error: userMessage }, { status: 500 })
  }
}
