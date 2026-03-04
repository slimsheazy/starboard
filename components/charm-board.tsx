"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { Charm, House } from "@/lib/types"
import { CharmTooltip } from "./charm-tooltip"
import { getCharmIcon } from "@/lib/charm-icons"
import { triggerGlitch } from "./sound-effects"

export interface HouseAssignment {
  houseIndex: number
  charmIndices: number[]
}

interface CharmBoardProps {
  charms: Charm[]
  houses: House[]
  onHouseAssignments?: (assignments: HouseAssignment[]) => void
}

interface CharmPosition {
  x: number
  y: number
  houseNumber: number
  houseName: string
  houseKeyword: string
  charmIndex: number // Track which charm this is within the house
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

export default function CharmBoard({ charms, houses, onHouseAssignments }: CharmBoardProps) {
  const [positions, setPositions] = useState<CharmPosition[]>([])
  const [selectedCharm, setSelectedCharm] = useState<{ charm: Charm; position: CharmPosition } | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [animationStates, setAnimationStates] = useState<string[]>([])

  useEffect(() => {
    console.log("🎯 CharmBoard received charms:", charms.length)
    if (charms.length === 0) return

    // Randomly distribute 12 charms across 12 houses (0-3 charms per house)
    const houseAssignments = distributeCharmsToHouses(charms, houses)
    console.log("🏠 House assignments:", houseAssignments)

    // Notify parent of assignments so synopsis can use them
    if (onHouseAssignments) {
      onHouseAssignments(houseAssignments)
    }

    // Calculate positions for each charm based on their house assignment
    const newPositions = charms
      .map((charm, charmIndex) => {
        const assignment = houseAssignments.find((h) => h.charmIndices.includes(charmIndex))
        if (!assignment) {
          console.error("❌ No house assignment found for charm", charmIndex)
          return null
        }

        const house = houses[assignment.houseIndex]
        const charmIndexInHouse = assignment.charmIndices.indexOf(charmIndex)

        // Calculate base angle for this house (counterclockwise from left)
        const baseAngle = 180 + assignment.houseIndex * -30

        // Position charms within the house based on how many are in this house
        const totalCharmsInHouse = assignment.charmIndices.length
        let angleOffset = 0
        let radiusOffset = 0

        if (totalCharmsInHouse === 1) {
          // Single charm: center of house sector
          angleOffset = 0
          radiusOffset = 0
        } else if (totalCharmsInHouse === 2) {
          // Two charms: spread them out
          angleOffset = charmIndexInHouse === 0 ? -8 : 8
          radiusOffset = charmIndexInHouse === 0 ? -3 : 3
        } else if (totalCharmsInHouse === 3) {
          // Three charms: triangle formation
          if (charmIndexInHouse === 0) {
            angleOffset = 0
            radiusOffset = -5
          } else if (charmIndexInHouse === 1) {
            angleOffset = -10
            radiusOffset = 5
          } else {
            angleOffset = 10
            radiusOffset = 5
          }
        }

        // Add some randomness but keep it controlled
        const randomAngleOffset = (Math.random() - 0.5) * 6 // ±3 degrees
        const randomRadiusOffset = (Math.random() - 0.5) * 4 // ±2% radius

        const finalAngle = baseAngle + angleOffset + randomAngleOffset
        const finalRadians = (finalAngle * Math.PI) / 180

        // Keep charms inside the wheel (15-40% from center)
        const baseRadius = 25 + radiusOffset + randomRadiusOffset
        const clampedRadius = Math.max(15, Math.min(40, baseRadius))

        // Calculate final position
        const x = 50 + clampedRadius * Math.cos(finalRadians)
        const y = 50 + clampedRadius * Math.sin(finalRadians)

        return {
          x,
          y,
          houseNumber: house.number,
          houseName: house.name,
          houseKeyword: house.contextKeyword || house.keyword,
          charmIndex: charmIndexInHouse,
        }
      })
      .filter(Boolean) as CharmPosition[]

    console.log("📍 Setting positions for", newPositions.length, "charms")
    setPositions(newPositions)

    // Set random animation states for each charm
    const animations = ["animate-shimmer", "animate-flicker", ""]
    const newAnimationStates = charms.map(() => {
      return animations[Math.floor(Math.random() * animations.length)]
    })
    setAnimationStates(newAnimationStates)
  }, [charms, houses])

  // Function to randomly distribute charms to houses
  const distributeCharmsToHouses = (charms: Charm[], houses: House[]) => {
    const assignments: { houseIndex: number; charmIndices: number[] }[] = []

    // Initialize all houses with empty arrays
    for (let i = 0; i < houses.length; i++) {
      assignments.push({ houseIndex: i, charmIndices: [] })
    }

    // Randomly assign each charm to a house (max 3 per house)
    const availableHouses = [...Array(houses.length).keys()]

    for (let charmIndex = 0; charmIndex < charms.length; charmIndex++) {
      // Filter houses that still have room (less than 3 charms)
      const housesWithRoom = availableHouses.filter((houseIndex) => assignments[houseIndex].charmIndices.length < 3)

      if (housesWithRoom.length === 0) {
        console.warn("⚠️ No houses with room available, this shouldn't happen with 12 charms and 12 houses")
        break
      }

      // Randomly select a house with room
      const selectedHouseIndex = housesWithRoom[Math.floor(Math.random() * housesWithRoom.length)]
      assignments[selectedHouseIndex].charmIndices.push(charmIndex)
    }

    // Log the distribution
    const distribution = assignments.map((assignment, index) => ({
      house: houses[index].name,
      charmCount: assignment.charmIndices.length,
    }))
    console.log("🎲 Charm distribution:", distribution)

    return assignments
  }

  const handleCharmClick = (charm: Charm, position: CharmPosition, event: React.MouseEvent) => {
    console.log("✨ Charm clicked:", charm.name, "in", position.houseName)

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
    console.log("🔒 Closing charm tooltip")
    setSelectedCharm(null)
  }

  console.log("🎨 Rendering CharmBoard with", charms.length, "charms and", positions.length, "positions")

  if (charms.length === 0) {
    console.log("❌ No charms to display")
    return null
  }

  if (positions.length === 0) {
    console.log("⏳ No positions calculated yet")
    return null
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      {charms.map((charm, index) => {
        if (!positions[index]) {
          console.log("❌ No position for charm", index)
          return null
        }

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
