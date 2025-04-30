"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { SavedReading } from "@/lib/types"
import { getCharmIcon } from "@/lib/charm-icons"
import { getCharmColor } from "@/lib/charm-colors"
import { Trash2 } from "lucide-react"

interface SavedReadingsProps {
  readings: SavedReading[]
  onClose: () => void
  onDelete: (id: string) => void
  onLoad: (reading: SavedReading) => void
}

export default function SavedReadings({ readings, onClose, onDelete, onLoad }: SavedReadingsProps) {
  const [expandedReading, setExpandedReading] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    if (expandedReading === id) {
      setExpandedReading(null)
    } else {
      setExpandedReading(id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="z-10 w-full max-w-md px-4"
    >
      <div className="bg-black/60 border border-white/20 rounded-lg p-4">
        <h2 className="text-lg font-medium text-white mb-4 text-center">Saved Readings</h2>

        {readings.length === 0 ? (
          <p className="text-center text-white/60 py-4">No saved readings yet</p>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {readings.map((reading) => (
              <div key={reading.id} className="border border-white/10 rounded-lg p-3 bg-black/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="cursor-pointer flex-1" onClick={() => toggleExpand(reading.id)}>
                    <p className="text-sm text-white/80">
                      {new Date(reading.date).toLocaleDateString()} at{" "}
                      {new Date(reading.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {reading.question && <p className="text-xs text-white/60 italic mt-1">"{reading.question}"</p>}
                  </div>
                  <button
                    onClick={() => onDelete(reading.id)}
                    className="text-white/40 hover:text-white/70 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {reading.charms.slice(0, 5).map((charm, idx) => {
                    const CharmIcon = getCharmIcon(charm.name)
                    const { lightColor, darkColor } = getCharmColor(charm.name)
                    const isRare = charm.rarity === "rare"

                    return (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${isRare ? "#fff8e1" : lightColor}, ${isRare ? "#ffd54f" : darkColor})`,
                        }}
                        title={charm.name}
                      >
                        <CharmIcon className="w-3 h-3 text-gray-800" />
                      </div>
                    )
                  })}
                  {reading.charms.length > 5 && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                      +{reading.charms.length - 5}
                    </div>
                  )}
                </div>

                {expandedReading === reading.id && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => onLoad(reading)}
                      className="w-full py-2 rounded-lg transition-colors bg-white/10 hover:bg-white/20 text-white text-xs"
                    >
                      Load this reading
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 border border-white/20 rounded-full text-sm hover:bg-white/5 transition-colors mx-auto block"
        >
          back
        </button>
      </div>
    </motion.div>
  )
}
