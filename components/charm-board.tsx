"use client"

import { motion } from "framer-motion"
import { getCharmIcon } from "@/lib/charm-icons"
import { charms } from "@/lib/charms"
import { getCosmicColor } from "@/lib/charm-colors"
import { Sparkles } from "lucide-react"

interface CharmBoardProps {
  selectedCharms: string[]
}

export function CharmBoard({ selectedCharms }: CharmBoardProps) {
  if (selectedCharms.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-black/90 border-2 border-white/20 rounded-lg shadow-lg p-4 text-center text-white/70">
        <Sparkles className="w-12 h-12 mx-auto mb-3 text-purple-400" />
        <p>Select charms to see them appear on your board.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-md mx-auto bg-black/90 border-2 border-white/20 rounded-lg shadow-lg p-4 grid grid-cols-3 gap-4 justify-items-center"
    >
      {selectedCharms.map((charmId) => {
        const charm = charms.find((c) => c.id === charmId)
        if (!charm) return null

        const CharmIcon = getCharmIcon(charm.name)
        const cosmicColor = getCosmicColor(charm.name)
        const isRare = charm.rarity === "rare"

        return (
          <motion.div
            key={charm.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${isRare ? "charm-rare-2d" : "charm-2d"}`}
              style={{
                backgroundColor: cosmicColor,
                boxShadow: isRare
                  ? `0 0 20px var(--color-star-yellow), 0 0 8px var(--color-star-yellow)`
                  : `0 0 10px ${cosmicColor}`,
              }}
            >
              <CharmIcon className="w-10 h-10 text-white" />
              {isRare && (
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute w-full h-full animate-pulse opacity-50"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-white mt-2">{charm.name}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
