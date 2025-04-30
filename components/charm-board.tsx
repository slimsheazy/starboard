"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { Charm, House } from "@/lib/types"
import { CharmTooltip } from "./charm-tooltip"
import { getCharmIcon } from "@/lib/charm-icons"
import { getCharmColor } from "@/lib/charm-colors"

interface CharmBoardProps {
  charms: Charm[]
  houses: House[]
}

export default function CharmBoard({ charms, houses }: CharmBoardProps) {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([])
  const [selectedCharm, setSelectedCharm] = useState<Charm | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    if (charms.length === 0) return

    // Calculate positions for each charm based on house positions
    const newPositions = charms.map((_, index) => {
      // Each charm is assigned to a house (12 charms, 12 houses)
      const houseIndex = index % houses.length

      // Calculate angle based on house position (counterclockwise from left)
      const angle = 180 + houseIndex * -30 // Start at left (180 degrees) and go counterclockwise
      const radians = (angle * Math.PI) / 180

      // Add some randomness to the position within the house
      // Keep charms inside the wheel by limiting radius to 15-40% from center
      const randomRadius = 15 + Math.random() * 25
      const randomAngleOffset = Math.random() * 20 - 10 // ±10 degrees
      const finalRadians = ((angle + randomAngleOffset) * Math.PI) / 180

      // Calculate final position
      const x = 50 + randomRadius * Math.cos(finalRadians)
      const y = 50 + randomRadius * Math.sin(finalRadians)

      return { x, y }
    })

    setPositions(newPositions)
  }, [charms, houses])

  const handleCharmClick = (charm: Charm, x: number, y: number, event: React.MouseEvent) => {
    // Get the position relative to the viewport for the tooltip
    const rect = event.currentTarget.getBoundingClientRect()
    const viewportX = rect.left + window.scrollX
    const viewportY = rect.top + window.scrollY

    setSelectedCharm(charm)
    setTooltipPosition({ x: viewportX, y: viewportY })
  }

  const closeTooltip = () => {
    setSelectedCharm(null)
  }

  if (charms.length === 0 || positions.length === 0) return null

  return (
    <div className="absolute inset-0 w-full h-full">
      {charms.map((charm, index) => {
        if (!positions[index]) return null

        // Get charm icon component
        const CharmIcon = getCharmIcon(charm.name)

        // Get charm color based on its category
        const { colorClass, lightColor, darkColor, category } = getCharmColor(charm.name)

        // Determine if it's a rare charm
        const isRare = charm.rarity === "rare"

        return (
          <motion.div
            key={`${charm.name}-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1],
              scale: [0, 1.2, 0.9, 1],
              y: [0, -8, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 1.5,
              delay: index * 0.1,
              y: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 2 + Math.random() * 1.5,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 3 + Math.random() * 2,
                ease: "easeInOut",
              },
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${positions[index].x}%`,
              top: `${positions[index].y}%`,
            }}
            onClick={(e) => handleCharmClick(charm, positions[index].x, positions[index].y, e)}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
              <div
                className={`w-7 h-7 md:w-9 md:h-9 rounded-full p-1 flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 ${isRare ? "charm-rare" : "charm-common"}`}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${isRare ? "#fff8e1" : lightColor}, ${isRare ? "#ffd54f" : darkColor})`,
                  boxShadow: isRare
                    ? "0 0 10px rgba(255, 215, 0, 0.7), inset 0 0 4px rgba(255, 255, 255, 0.8)"
                    : `0 0 8px ${lightColor}80, inset 0 0 4px rgba(255, 255, 255, 0.8)`,
                }}
              >
                <CharmIcon
                  className={`w-4 h-4 md:w-5 md:h-5 ${isRare ? "text-amber-800" : darkColor.includes("rgb") ? "text-gray-800" : colorClass.replace("from-", "text-").replace("-200", "-800")}`}
                />

                {/* Sparkle effect for rare charms */}
                {isRare && (
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute w-full h-full animate-pulse opacity-50 bg-gradient-to-br from-yellow-200 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <div
                      className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}

      {selectedCharm && <CharmTooltip charm={selectedCharm} position={tooltipPosition} onClose={closeTooltip} />}
    </div>
  )
}
