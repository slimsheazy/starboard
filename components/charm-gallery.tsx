"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getCharmIcon } from "@/lib/charm-icons"
import { getCharmColor } from "@/lib/charm-colors"
import type { Charm } from "@/lib/types"
import { Search, Sparkles, Crown } from "lucide-react"

interface CharmGalleryProps {
  charms: Charm[]
}

export default function CharmGallery({ charms }: CharmGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRarity, setSelectedRarity] = useState<"all" | "common" | "uncommon" | "rare">("all")
  const [selectedCharm, setSelectedCharm] = useState<Charm | null>(null)

  const filteredCharms = charms.filter((charm) => {
    const matchesSearch =
      charm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charm.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRarity = selectedRarity === "all" || charm.rarity === selectedRarity
    return matchesSearch && matchesRarity
  })

  const triggerHapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const handleCharmClick = (charm: Charm) => {
    triggerHapticFeedback()
    setSelectedCharm(charm)
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "rare":
        return <Crown className="w-4 h-4 text-yellow-400" />
      case "uncommon":
        return <Sparkles className="w-4 h-4 text-purple-400" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "rare":
        return "border-yellow-400/50 bg-yellow-400/5"
      case "uncommon":
        return "border-purple-400/50 bg-purple-400/5"
      default:
        return "border-white/20 bg-white/5"
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search charms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 justify-center">
          {["all", "common", "uncommon", "rare"].map((rarity) => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRarity === rarity ? "bg-purple-600 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Charm Grid */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" layout>
        <AnimatePresence>
          {filteredCharms.map((charm, index) => {
            const CharmIcon = getCharmIcon(charm.name)
            const charmColor = getCharmColor(charm.name)

            return (
              <motion.div
                key={charm.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  z: 50,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCharmClick(charm)}
                className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${getRarityColor(charm.rarity)} hover:shadow-lg hover:shadow-purple-500/20`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Rarity indicator */}
                <div className="absolute top-2 right-2">{getRarityIcon(charm.rarity)}</div>

                {/* Charm icon */}
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: charmColor,
                    boxShadow: `0 0 20px ${charmColor}40`,
                  }}
                >
                  <CharmIcon className="w-6 h-6 text-white" />
                </div>

                {/* Charm name */}
                <h3 className="text-sm font-medium text-white text-center mb-2 leading-tight">{charm.name}</h3>

                {/* Short description */}
                <p className="text-xs text-white/60 text-center line-clamp-2">{charm.description.split(".")[0]}.</p>

                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${charmColor}, transparent 70%)`,
                  }}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* No results */}
      {filteredCharms.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-white/60">No charms found matching your criteria</p>
        </motion.div>
      )}

      {/* Charm Detail Modal */}
      <AnimatePresence>
        {selectedCharm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCharm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/90 border border-white/20 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {getRarityIcon(selectedCharm.rarity)}
                  <span className="text-sm text-white/70 capitalize">{selectedCharm.rarity}</span>
                </div>

                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: getCharmColor(selectedCharm.name),
                    boxShadow: `0 0 30px ${getCharmColor(selectedCharm.name)}60`,
                  }}
                >
                  {(() => {
                    const CharmIcon = getCharmIcon(selectedCharm.name)
                    return <CharmIcon className="w-10 h-10 text-white" />
                  })()}
                </div>

                <h2 className="text-xl font-medium text-white mb-4">{selectedCharm.name}</h2>
                <p className="text-white/80 leading-relaxed mb-6">{selectedCharm.description}</p>

                <button
                  onClick={() => setSelectedCharm(null)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
