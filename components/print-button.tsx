"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PrintButtonProps {
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

export function PrintButton({
  concertTitle,
  concertComposer,
  venue,
  date,
  time,
  tickets,
  bookingReference,
  totalAmount,
  fullName,
  email,
  bookingDate,
}: PrintButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState(email)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailStatus, setEmailStatus] = useState<string | null>(null)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve()
      }
      const script = document.createElement("script")
      script.src = src
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      document.head.appendChild(script)
    })

  const getQRCodeDataUrl = async (text: string): Promise<string> => {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js")
    const QRCode = (window as any).QRCode
    if (!QRCode) {
      throw new Error("QR Code library unavailable")
    }

    return new Promise<string>((resolve, reject) => {
      const container = document.createElement("div")
      container.style.position = "fixed"
      container.style.left = "-9999px"
      container.style.top = "-9999px"
      document.body.appendChild(container)

      const instance = new QRCode(container, {
        text,
        width: 160,
        height: 160,
        colorDark: "#1b1b1b",
        colorLight: "#f3f2ef",
        correctLevel: (QRCode as any).CorrectLevel.H,
      })

      setTimeout(() => {
        const img = container.querySelector("img") as HTMLImageElement | null
        const canvas = container.querySelector("canvas") as HTMLCanvasElement | null

        let url = ""
        if (img && img.src) {
          url = img.src
        } else if (canvas) {
          url = canvas.toDataURL("image/png")
        }

        document.body.removeChild(container)

        if (!url) {
          reject(new Error("Failed to create QR image"))
        } else {
          resolve(url)
        }
      }, 100)
    })
  }

  const createTicketPdf = async () => {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
    const qrDataUrl = await getQRCodeDataUrl(bookingReference)

    // @ts-ignore
    const { jsPDF } = window.jspdf
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(15, 20, 180, 180, 4, 4, "F")
    pdf.setDrawColor(226, 232, 240)
    pdf.setLineWidth(0.3)
    pdf.roundedRect(15, 20, 180, 180, 4, 4, "S")

    pdf.setFillColor(14, 14, 14)
    pdf.rect(15, 20, 180, 20, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(16)
    pdf.setTextColor(255, 255, 255)
    pdf.text("Wiener Oper", 20, 34)
    pdf.setFontSize(10)
    pdf.text("E-Ticket", 182, 34, { align: "right" })

    pdf.setTextColor(20, 20, 20)
    pdf.setFont("times", "bold")
    pdf.setFontSize(28)
    pdf.text(concertTitle, 20, 58)

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(concertComposer, 20, 68)

    const infoY = 78
    const infoHeight = 16
    const infoW = 83

    pdf.setFillColor(241, 241, 241)
    pdf.rect(15, infoY, infoW, infoHeight, "F")
    pdf.rect(112, infoY, infoW, infoHeight, "F")
    pdf.rect(15, infoY + 20, infoW, infoHeight, "F")
    pdf.rect(112, infoY + 20, infoW, infoHeight, "F")

    pdf.setTextColor(110, 110, 110)
    pdf.setFontSize(8)

    pdf.text("Venue", 19, infoY + 6)
    pdf.setFontSize(11)
    pdf.setTextColor(30, 30, 30)
    pdf.text(venue, 19, infoY + 14)

    pdf.setFontSize(8)
    pdf.setTextColor(110, 110, 110)
    pdf.text("Date", 116, infoY + 6)
    pdf.setFontSize(11)
    pdf.setTextColor(30, 30, 30)
    pdf.text(date, 116, infoY + 14)

    pdf.setFontSize(8)
    pdf.setTextColor(110, 110, 110)
    pdf.text("Time", 19, infoY + 26)
    pdf.setFontSize(11)
    pdf.setTextColor(30, 30, 30)
    pdf.text(time, 19, infoY + 34)

    pdf.setFontSize(8)
    pdf.setTextColor(110, 110, 110)
    pdf.text("Tickets", 116, infoY + 26)
    pdf.setFontSize(11)
    pdf.setTextColor(30, 30, 30)
    pdf.text(`${tickets} ${tickets === 1 ? "ticket" : "tickets"}`, 116, infoY + 34)

    pdf.setDrawColor(226, 232, 240)
    pdf.setLineWidth(0.2)
    pdf.line(15, 114, 195, 114)

    const qrX = 15
    const qrY = 120
    const qrSize = 40

    pdf.setFillColor(241, 241, 241)
    pdf.roundedRect(qrX, qrY, qrSize, qrSize, 2, 2, "F")
    pdf.setDrawColor(226, 232, 240)
    pdf.roundedRect(qrX, qrY, qrSize, qrSize, 2, 2, "S")

    pdf.addImage(qrDataUrl, "PNG", qrX + 2, qrY + 2, qrSize - 4, qrSize - 4)

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    pdf.setTextColor(110, 110, 110)
    pdf.text("Booking Reference", 62, 124)

    pdf.setFont("courier", "bold")
    pdf.setFontSize(14)
    pdf.setTextColor(133, 86, 16)
    pdf.text(bookingReference, 62, 136)

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9)
    pdf.setTextColor(110, 110, 110)
    pdf.text(`Booked on ${bookingDate}`, 62, 145)

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(18)
    pdf.setTextColor(5, 5, 5)
    pdf.text(totalAmount, 190, 136, { align: "right" })

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9)
    pdf.setTextColor(60, 60, 60)
    pdf.text(`Name: ${fullName}`, 20, 166)
    pdf.text(`Email: ${email}`, 20, 172)

    pdf.setFontSize(8)
    pdf.setTextColor(104, 104, 104)
    pdf.text("Please present this ticket at the venue entrance. This ticket is non-transferable.", 20, 180)

    return pdf
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    setEmailStatus(null)
    try {
      const pdf = await createTicketPdf()
      pdf.save("ticket.pdf")
    } catch (error) {
      console.error("Error downloading PDF:", error)
      setEmailStatus("Failed to create PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!recipientEmail || !emailRegex.test(recipientEmail)) {
      setEmailStatus("Please enter a valid email address.")
      return
    }

    setIsSendingEmail(true)
    setEmailStatus(null)

    try {
      const response = await fetch("/api/send-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          ticketData: {
            concertTitle,
            concertComposer,
            venue,
            date,
            time,
            tickets,
            bookingReference,
            totalAmount,
            fullName,
            email,
            bookingDate,
          },
        }),
      })

      let result: any
      const text = await response.text()
      try {
        result = JSON.parse(text)
      } catch {
        result = { error: `Unexpected response: ${text.slice(0, 200)}` }
      }

      if (!response.ok || result?.success === false) {
        setEmailStatus(result?.error || "Failed to send email.")
        setIsSendingEmail(false)
        return
      }

      setEmailStatus("Ticket successfully sent to your email!")
    } catch (error) {
      console.error("Email send error:", error)
      setEmailStatus("Unable to send ticket. Please try again later.")
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button onClick={handleDownloadPDF} variant="secondary" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="Recipient email"
          className="h-10 rounded border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Button
          onClick={handleSendEmail}
          variant="secondary"
          className="h-10"
          disabled={isSendingEmail}
        >
          {isSendingEmail ? "Sending..." : "Send to Email"}
        </Button>
      </div>
      {emailStatus && (
        <p className="text-sm font-medium text-muted-foreground">{emailStatus}</p>
      )}
    </div>
  )
}


