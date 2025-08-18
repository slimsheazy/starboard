"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CharmTooltip } from "./charm-tooltip"
import { triggerGlitch } from "./sound-effects"
import type { Charm, House } from "@/lib/types"
import { getCharmIcon } from "@/lib/charm-icons"
import { getCharmColor } from "@/lib/charm-colors"

interface CharmBoardProps {
  charms: Charm[]
  houses: House[]
}

export default function CharmBoard({ charms, houses }: CharmBoardProps) {
  const [selectedCharm, setSelectedCharm] = useState<Charm | null>(null)

  const handleCharmClick = (charm: Charm) => {
    console.log("Charm clicked:", charm.name)
    triggerGlitch()
    setSelectedCharm(charm)
  }

  const closeTooltip = () => {
    setSelectedCharm(null)
  }

  // Position charms around the wheel
  const getCharmPosition = (index: number, total: number) => {
    const angle = (index * 360) / total
    const radius = 45 // Percentage from center
    const x = 50 + radius * Math.cos((angle - 90) * (Math.PI / 180))
    const y = 50 + radius * Math.sin((angle - 90) * (Math.PI / 180))
    return { x, y, angle }
  }

  return (
    <>
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {charms.map((charm, index) => {
            const position = getCharmPosition(index, charms.length)
            const CharmIcon = getCharmIcon(charm.name)
            const charmColor = getCharmColor(charm.rarity)

            return (
              <motion.div
                key={`${charm.name}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => handleCharmClick(charm)}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${charmColor.bg} ${charmColor.border} border-2 shadow-lg backdrop-blur-sm`}
                  style={{
                    boxShadow: `0 0 20px ${charmColor.glow}`,
                  }}
                >
                  <CharmIcon className={`w-4 h-4 ${charmColor.text}`} />
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedCharm && (
          <CharmTooltip
            charm={selectedCharm}
            house={houses[charms.indexOf(selectedCharm) % houses.length]}
            onClose={closeTooltip}
          />
        )}
      </AnimatePresence>
    </>
  )
}
