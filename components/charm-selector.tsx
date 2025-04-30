"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Charm } from "@/lib/types"
import { getCharmIcon } from "@/lib/charm-icons"
import { CharmTooltip } from "./charm-tooltip"
import { Search, Check } from "lucide-react"
import { getCharmColor } from "@/lib/charm-colors"

interface CharmSelectorProps {
  allCharms: Charm[]
  selectedCharms: Charm[]
  onSelectCharm: (charm: Charm) => void
  onRemoveCharm: (charm: Charm) => void
  onRandomize: () => void
  onConfirm: () => void
}

export default function CharmSelector({
  allCharms,
  selectedCharms,
  onSelectCharm,
  onRemoveCharm,
  onRandomize,
  onConfirm,
}: CharmSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCharm, setSelectedCharm] = useState<Charm | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

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
  }

  const toggleCharmSelection = (charm: Charm) => {
    const isSelected = selectedCharms.some((c) => c.name === charm.name)
    if (isSelected) {
      onRemoveCharm(charm)
    } else if (selectedCharms.length < 12) {
      onSelectCharm(charm)
    }
  }

  const closeTooltip = () => {
    setSelectedCharm(null)
  }

  // Group charms by color category
  const charmsByCategory: Record<string, Charm[]> = {}

  filteredCharms.forEach((charm) => {
    const { category } = getCharmColor(charm.name)

    if (!charmsByCategory[category]) {
      charmsByCategory[category] = []
    }
    charmsByCategory[category].push(charm)
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto bg-black/90 border border-white/20 rounded-lg shadow-lg p-4 z-20 relative"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">Select Your Charms</h2>
        <span className="text-sm text-white/70 bg-white/10 px-2 py-1 rounded-full">{selectedCharms.length}/12</span>
      </div>

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-white/50" />
        </div>
        <input
          type="text"
          placeholder="Search charms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/50 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
        />
      </div>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 charm-list">
        {Object.entries(charmsByCategory).map(([category, charms]) => (
          <div key={category} className="border border-white/10 rounded-lg p-3 bg-black/30">
            <h3 className="text-sm font-medium text-white/80 mb-2">{category}</h3>
            <div className="grid grid-cols-4 gap-2">
              {charms.map((charm, index) => {
                const CharmIcon = getCharmIcon(charm.name)
                const isSelected = selectedCharms.some((c) => c.name === charm.name)
                const isRare = charm.rarity === "rare"
                const { colorClass, lightColor, darkColor } = getCharmColor(charm.name)

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
                      className={`w-12 h-12 rounded-full p-1 flex items-center justify-center mx-auto ${isRare ? "ring-2 ring-yellow-400 ring-opacity-70" : ""} ${isSelected ? "ring-2 ring-white ring-opacity-80" : ""}`}
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${isRare ? "#fff8e1" : lightColor}, ${isRare ? "#ffd54f" : darkColor})`,
                        boxShadow: isRare
                          ? "0 0 10px rgba(255, 215, 0, 0.7), inset 0 0 4px rgba(255, 255, 255, 0.8)"
                          : `0 0 8px ${lightColor}80, inset 0 0 4px rgba(255, 255, 255, 0.8)`,
                      }}
                    >
                      <CharmIcon
                        className={`w-6 h-6 ${isRare ? "text-amber-800" : darkColor.includes("rgb") ? "text-gray-800" : colorClass.replace("from-", "text-").replace("-200", "-800")}`}
                      />
                      {isRare && (
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                          <div className="absolute w-full h-full animate-pulse opacity-50 bg-gradient-to-br from-yellow-200 to-transparent"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-white z-10">
                        <Check size={12} className="text-black" />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={onRandomize}
          className="flex-1 py-2 rounded-lg transition-colors bg-black/50 border border-white/20 hover:bg-white/10 text-white text-sm"
        >
          Randomize
        </button>
        <button
          onClick={onConfirm}
          disabled={selectedCharms.length === 0}
          className="flex-1 py-2 rounded-lg transition-colors bg-white/10 hover:bg-white/20 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cast Charms
        </button>
      </div>

      {selectedCharm && <CharmTooltip charm={selectedCharm} position={tooltipPosition} onClose={closeTooltip} />}
    </motion.div>
  )
}
