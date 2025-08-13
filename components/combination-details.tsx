"use client"

import { motion } from "framer-motion"
import type { CharmCombination } from "@/lib/charm-combinations"
import { getCharmIcon } from "@/lib/charm-icons"
import { CloseIcon } from "./cosmic-icons"

interface CombinationDetailsProps {
  combination: CharmCombination
  onClose: () => void
}

export default function CombinationDetails({ combination, onClose }: CombinationDetailsProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-purple-600 to-purple-800"
      case "rare":
        return "from-red-600 to-red-800"
      case "uncommon":
        return "from-blue-600 to-blue-800"
      default:
        return "from-green-600 to-green-800"
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "border-purple-400"
      case "rare":
        return "border-red-400"
      case "uncommon":
        return "border-blue-400"
      default:
        return "border-green-400"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "power":
        return "⚡"
      case "warning":
        return "⚠️"
      case "transformation":
        return "🔄"
      case "insight":
        return "💡"
      case "timing":
        return "⏰"
      default:
        return "✨"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
    >
      <div className="w-full max-w-md bg-black/90 border-2 border-white/20 rounded-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 bg-gradient-to-r ${getRarityColor(combination.rarity)} text-white`}
          >
            {combination.rarity.toUpperCase()}
          </div>

          <h2 className="text-xl font-bold text-white mb-1">{combination.name}</h2>

          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-lg">{getCategoryIcon(combination.category)}</span>
            <span className="text-sm text-white/70 capitalize">{combination.category}</span>
          </div>

          <p className="text-sm text-white/80 italic">"{combination.description}"</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-white/90 mb-2">Charms in this combination:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {combination.charms.map((charmName, index) => {
              const CharmIcon = getCharmIcon(charmName)
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRarityBorder(combination.rarity)} bg-white/5`}
                >
                  <CharmIcon className="w-4 h-4 text-white" />
                  <span className="text-xs text-white">{charmName}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-sm font-medium text-white/90 mb-2">Interpretation:</h3>
          <p className="text-sm text-white/80 leading-relaxed">{combination.interpretation}</p>
        </div>
      </div>
    </motion.div>
  )
}
