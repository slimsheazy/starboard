"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { Charm, House } from "@/lib/types"
import { CharmTooltip } from "./charm-tooltip"
import { getCharmIcon } from "@/lib/charm-icons"
import { triggerGlitch } from "./sound-effects"

interface CharmBoardProps {
  charms: Charm[]
  houses: House[]
}

interface CharmPosition {
  x: number
  y: number
  houseNumber: number
  houseName: string
  houseKeyword: string
}

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

export default function CharmBoard({ charms, houses }: CharmBoardProps) {
  const [positions, setPositions] = useState<CharmPosition[]>([])
  const [selectedCharm, setSelectedCharm] = useState<{ charm: Charm; position: CharmPosition } | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [animationStates, setAnimationStates] = useState<string[]>([])

  useEffect(() => {
    if (charms.length === 0) return

    // Calculate positions for each charm based on house positions
    const newPositions = charms.map((_, index) => {
      // Each charm is assigned to a house (12 charms, 12 houses)
      const houseIndex = index % houses.length
      const house = houses[houseIndex]

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

      return {
        x,
        y,
        houseNumber: house.number,
        houseName: house.name,
        houseKeyword: house.contextKeyword || house.keyword,
      }
    })

    setPositions(newPositions)

    // Set random animation states for each charm
    const animations = ["animate-shimmer", "animate-flicker", ""]
    const newAnimationStates = charms.map(() => {
      return animations[Math.floor(Math.random() * animations.length)]
    })
    setAnimationStates(newAnimationStates)
  }, [charms, houses])

  const handleCharmClick = (charm: Charm, position: CharmPosition, event: React.MouseEvent) => {
    console.log("Charm clicked:", charm.name)

    // Get the position relative to the viewport for the tooltip
    const rect = event.currentTarget.getBoundingClientRect()
    const viewportX = rect.left + window.scrollX
    const viewportY = rect.top + window.scrollY

    setSelectedCharm({ charm, position })
    setTooltipPosition({ x: viewportX, y: viewportY })

    // Trigger glitch sound effect
    triggerGlitch()
  }

  const closeTooltip = () => {
    console.log("Closing charm tooltip")
    setSelectedCharm(null)
  }

  if (charms.length === 0 || positions.length === 0) return null

  return (
    <div className="absolute inset-0 w-full h-full">
      {charms.map((charm, index) => {
        if (!positions[index]) return null

        // Get charm icon component
        const CharmIcon = getCharmIcon(charm.name)

        // Get charm color based on cosmic palette
        const cosmicColor = getCosmicColor(charm.name)

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
            onClick={(e) => handleCharmClick(charm, positions[index], e)}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <div
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center ${isRare ? "charm-rare-2d" : "charm-2d"} ${animationStates[index]}`}
                style={{
                  backgroundColor: cosmicColor,
                  boxShadow: isRare
                    ? `0 0 15px var(--color-star-yellow), 0 0 5px var(--color-star-yellow)`
                    : `0 0 8px ${cosmicColor}`,
                }}
              >
                <CharmIcon className={`w-5 h-5 md:w-6 md:h-6 text-white`} />

                {/* Glitch effect for rare charms */}
                {isRare && (
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute w-full h-full animate-pulse opacity-50"></div>
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

      {selectedCharm && (
        <CharmTooltip
          charm={selectedCharm.charm}
          position={tooltipPosition}
          houseInfo={selectedCharm.position}
          onClose={closeTooltip}
        />
      )}
    </div>
  )
}
