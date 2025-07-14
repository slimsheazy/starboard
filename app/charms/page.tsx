"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { charms } from "@/lib/charms"
import { getCharmIcon } from "@/lib/charm-icons"
import { SearchIcon, HomeIcon } from "@/components/cosmic-icons"
import Link from "next/link"
import StarBackground from "@/components/star-background"
import { triggerWhisper } from "@/components/sound-effects"

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

  return (
    <main className="relative min-h-screen bg-black text-white pb-20">
      <StarBackground />

      <div className="container max-w-md mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Charm Catalog</h1>
          <Link
            href="/"
            className="p-2 rounded-full bg-black/30 border-2 border-white/20 hover:border-white/40 transition-colors"
            onClick={() => triggerWhisper()}
          >
            <HomeIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-white/50" />
          </div>
          <input
            type="text"
            placeholder="Search charms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border-2 border-white/20 rounded-lg pl-10 pr-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
          />
        </div>

        <div className="space-y-6">
          {Object.entries(charmsByCategory).map(([category, categoryCharms]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border-2 border-white/10 rounded-lg p-4 bg-black/30"
            >
              <h2 className="text-lg font-medium mb-4 text-white/90">{category}</h2>
              <div className="space-y-4">
                {categoryCharms.map((charm) => {
                  const CharmIcon = getCharmIcon(charm.name)
                  const isRare = charm.rarity === "rare"
                  const cosmicColor = getCosmicColor(charm.name)

                  return (
                    <div key={charm.name} className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isRare ? "charm-rare-2d" : "charm-2d"}`}
                        style={{
                          backgroundColor: cosmicColor,
                          boxShadow: isRare
                            ? `0 0 15px var(--color-star-yellow), 0 0 5px var(--color-star-yellow)`
                            : `0 0 8px ${cosmicColor}`,
                        }}
                      >
                        <CharmIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{charm.name}</h3>
                          {isRare && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-black/50 border border-yellow-400 text-yellow-400">
                              Rare
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/70 mt-1">{charm.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
