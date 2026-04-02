"use server"

import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

export async function generateTicketPDF(htmlContent: string) {
  try {
    // Create a temporary canvas from the HTML
    const canvas = await html2canvas(htmlContent, {
      backgroundColor: "#ffffff",
      scale: 2,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

    return pdf.output("arraybuffer")
  } catch (error) {
    console.error("PDF generation error:", error)
    throw new Error("Failed to generate PDF")
  }
}
