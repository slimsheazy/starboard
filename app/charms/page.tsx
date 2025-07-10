"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { charms } from "@/lib/charms"
import StarBackground from "@/components/star-background"
import BottomNav from "@/components/bottom-nav"
import CharmGallery from "@/components/charm-gallery"

// Function to get a cosmic color based on charm name
const getCosmicColor = (charmName: string): string => {
  // Use the first character code to determine color
  const charCode = charmName.charCodeAt(0)

  // Assign colors based on character code modulo 4
  if (charCode % 4 === 0) {
    return "var(--color-deep-purple)"
  } else if (charCode % 4 === 1) {
    return "var(--color-neon-pink)"
  } else if (charCode % 4 === 2) {
    return "var(--color-acid-green)"
  } else {
    return "var(--color-cosmic-blue)"
  }
}

// Function to get category based on charm name
const getCategory = (charmName: string): string => {
  const charCode = charmName.charCodeAt(0)

  if (charCode % 5 === 0) return "Growth"
  if (charCode % 5 === 1) return "Challenges"
  if (charCode % 5 === 2) return "Opportunities"
  if (charCode % 5 === 3) return "Transitions"
  return "Insights"
}

export default function CharmsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [savedReadings, setSavedReadings] = useState([])
  const [showSavedReadings, setShowSavedReadings] = useState(false)

  const filteredCharms = charms.filter(
    (charm) =>
      charm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charm.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group charms by category
  const charmsByCategory: Record<string, typeof charms> = {}

  filteredCharms.forEach((charm) => {
    const category = getCategory(charm.name)

    if (!charmsByCategory[category]) {
      charmsByCategory[category] = []
    }
    charmsByCategory[category].push(charm)
  })

  const toggleSavedReadings = () => {
    setShowSavedReadings(!showSavedReadings)
  }

  return (
    <main className="relative min-h-screen bg-black text-white pb-20">
      <StarBackground />

      <div className="relative z-10 px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-extralight tracking-widest mb-2">charm gallery</h1>
          <p className="text-white/70 text-sm">Discover the mystical powers within each charm</p>
        </motion.div>

        <CharmGallery charms={charms} />
      </div>

      <BottomNav onOpenSavedReadings={toggleSavedReadings} savedReadingsCount={savedReadings.length} />
    </main>
  )
}
