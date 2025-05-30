import { jsPDF } from "jspdf"
import type { Charm, House } from "./types"
import { getCharmColor } from "./charm-colors"

export function generateReadingPDF(question: string, charms: Charm[], houses: House[], date: Date = new Date()): void {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Set up some constants for formatting
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  // Add title
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("Starboard Reading", pageWidth / 2, margin, { align: "center" })

  // Add date
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(
    `Date: ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    pageWidth / 2,
    margin + 10,
    { align: "center" },
  )

  // Add question if available
  let yPosition = margin + 20
  if (question) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Question:", margin, yPosition)
    doc.setFont("helvetica", "italic")
    doc.text(`"${question}"`, margin, yPosition + 7)
    yPosition += 15
  }

  // Add charms section title
  yPosition += 5
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Charms in Your Reading", margin, yPosition)
  yPosition += 10

  // Add each charm with its description
  doc.setFontSize(12)
  charms.forEach((charm, index) => {
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      yPosition = margin
    }

    const { category } = getCharmColor(charm.name)
    const isRare = charm.rarity === "rare"

    // Charm name and category
    doc.setFont("helvetica", "bold")
    doc.text(`${index + 1}. ${charm.name}`, margin, yPosition)

    // Add rarity and category
    doc.setFont("helvetica", "italic")
    doc.setFontSize(10)
    doc.text(`${isRare ? "✦ Rare" : "Common"} • ${category}`, margin + 60, yPosition)

    // Charm description
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    // Handle text wrapping for description
    const splitDescription = doc.splitTextToSize(charm.description, contentWidth)
    doc.text(splitDescription, margin, yPosition + 7)

    // Move position for next charm
    yPosition += 7 + splitDescription.length * 7
  })

  // Add houses section if there's room, otherwise add a new page
  if (yPosition > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage()
    yPosition = margin
  } else {
    yPosition += 15
  }

  // Add houses section title
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Astrological Houses", margin, yPosition)
  yPosition += 10

  // Add each house with its keyword and description
  doc.setFontSize(12)
  houses.forEach((house, index) => {
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      yPosition = margin
    }

    // House name and number
    doc.setFont("helvetica", "bold")
    doc.text(`House ${house.number}: ${house.name}`, margin, yPosition)

    // House keyword
    doc.setFont("helvetica", "italic")
    doc.text(`Keyword: ${house.contextKeyword || house.keyword}`, margin, yPosition + 7)

    // House description
    doc.setFont("helvetica", "normal")

    // Handle text wrapping for description
    const splitDescription = doc.splitTextToSize(house.description, contentWidth)
    doc.text(splitDescription, margin, yPosition + 14)

    // Move position for next house
    yPosition += 14 + splitDescription.length * 7
  })

  // Add footer
  const footerText = "Generated by Starboard • www.starboard-app.com"
  doc.setFontSize(10)
  doc.setTextColor(150, 150, 150)
  doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" })

  // Save the PDF
  doc.save(`starboard-reading-${date.toISOString().split("T")[0]}.pdf`)
}
