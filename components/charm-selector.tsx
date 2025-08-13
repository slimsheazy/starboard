"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import type { Charm } from "@/lib/types"
import { getCharmIcon } from "@/lib/charm-icons"
import { CharmTooltip } from "./charm-tooltip"
import { SearchIcon, CheckIcon } from "./cosmic-icons"
import { triggerFlintStrike } from "./sound-effects"
import { charms } from "@/lib/charms"

interface CharmSelectorProps {
  onCharmsChange: (charms: string[]) => void
  selectedCharms: string[]
}

// Function to get a cosmic color based on charm name
const getCosmicColor = (charmName: string): string => {
  const charCode = charmName.charCodeAt(0)

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

export function CharmSelector({ onCharmsChange, selectedCharms = [] }: CharmSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCharm, setSelectedCharm] = useState<Charm | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const allCharms = charms || []

  const filteredCharms = allCharms.filter(
    (charm) =>
      charm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charm.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCharmClick = (charm: Charm, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const viewportX = rect.left + window.scrollX
    const viewportY = rect.top + window.scrollY

    setSelectedCharm(charm)
    setTooltipPosition({ x: viewportX, y: viewportY })
    triggerFlintStrike()
  }

  const toggleCharmSelection = (charm: Charm) => {
    const isSelected = selectedCharms.includes(charm.id)
    if (isSelected) {
      onCharmsChange(selectedCharms.filter((id) => id !== charm.id))
    } else if (selectedCharms.length < 3) {
      onCharmsChange([...selectedCharms, charm.id])
    }
  }

  const closeTooltip = () => {
    setSelectedCharm(null)
  }

  // Group charms by category
  const charmsByCategory: Record<string, Charm[]> = {}

  filteredCharms.forEach((charm) => {
    const category = getCategory(charm.name)

    if (!charmsByCategory[category]) {
      charmsByCategory[category] = []
    }
    charmsByCategory[category].push(charm)
  })

  if (allCharms.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-black/90 border-2 border-white/20 rounded-lg shadow-lg p-4">
        <p className="text-white text-center">Loading charms...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto bg-black/90 border-2 border-white/20 rounded-lg shadow-lg p-4 z-20 relative"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">Select Your Charms</h2>
        <span className="text-sm text-white/70 bg-black/50 border border-white/20 px-2 py-1 rounded-full">
          {selectedCharms.length}/3
        </span>
      </div>

      <div className="mb-4 relative">
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

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 charm-list">
        {Object.entries(charmsByCategory).map(([category, categoryCharms]) => (
          <div key={category} className="border-2 border-white/10 rounded-lg p-3 bg-black/30">
            <h3 className="text-sm font-medium text-white/80 mb-2">{category}</h3>
            <div className="grid grid-cols-4 gap-2">
              {categoryCharms.map((charm, index) => {
                const CharmIcon = getCharmIcon(charm.name)
                const isSelected = selectedCharms.includes(charm.id)
                const isRare = charm.rarity === "rare"
                const cosmicColor = getCosmicColor(charm.name)

                return (
                  <motion.div
                    key={`${charm.name}-${index}`}
                    whileHover={{ scale: 1.1 }}
                    className="cursor-pointer relative"
                    onClick={(e) => {
                      toggleCharmSelection(charm)
                      handleCharmClick(charm, e)
                    }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${isRare ? "charm-rare-2d" : "charm-2d"} ${isSelected ? "ring-2 ring-white" : ""}`}
                      style={{
                        backgroundColor: cosmicColor,
                        boxShadow: isRare
                          ? `0 0 15px var(--color-star-yellow), 0 0 5px var(--color-star-yellow)`
                          : `0 0 8px ${cosmicColor}`,
                      }}
                    >
                      <CharmIcon className="w-6 h-6 text-white" />
                      {isRare && (
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                          <div className="absolute w-full h-full animate-pulse opacity-50"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-black z-10">
                        <CheckIcon className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedCharm && <CharmTooltip charm={selectedCharm} position={tooltipPosition} onClose={closeTooltip} />}
    </motion.div>
  )
}
