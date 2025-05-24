"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { Charm } from "@/lib/types"
import { getCharmIcon } from "@/lib/charm-icons"
import { CloseIcon } from "./cosmic-icons"

interface CharmTooltipProps {
  charm: Charm
  position: { x: number; y: number }
  houseInfo: {
    houseNumber: number
    houseName: string
    houseKeyword: string
  }
  onClose: () => void
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

// Function to get category based on charm name
const getCategory = (charmName: string): string => {
  const charCode = charmName.charCodeAt(0)

  if (charCode % 5 === 0) return "Growth"
  if (charCode % 5 === 1) return "Challenges"
  if (charCode % 5 === 2) return "Opportunities"
  if (charCode % 5 === 3) return "Transitions"
  return "Insights"
}

export function CharmTooltip({ charm, position, houseInfo, onClose }: CharmTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const CharmIcon = getCharmIcon(charm.name)

  // Get charm color and category
  const cosmicColor = getCosmicColor(charm.name)
  const category = getCategory(charm.name)

  // Determine if it's a rare charm
  const isRare = charm.rarity === "rare"

  useEffect(() => {
    // Close tooltip when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Adjust position to ensure tooltip is visible in viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 300),
    y: Math.min(position.y, window.innerHeight - 250),
  }

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 w-72 bg-black/90 border-2 border-white/20 rounded-lg shadow-lg p-4"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        transform: "translate(-50%, -120%)",
      }}
    >
      <button onClick={onClose} className="absolute top-2 right-2 text-white/60 hover:text-white">
        <CloseIcon className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center">
        <div
          className={`mb-2 p-2 rounded-full flex items-center justify-center ${isRare ? "charm-rare-2d" : "charm-2d"}`}
          style={{
            backgroundColor: cosmicColor,
            boxShadow: isRare
              ? `0 0 15px var(--color-star-yellow), 0 0 5px var(--color-star-yellow)`
              : `0 0 8px ${cosmicColor}`,
          }}
        >
          <CharmIcon className="w-6 h-6 text-white" />

          {/* Glitch effect for rare charms */}
          {isRare && (
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute w-full h-full animate-pulse opacity-50"></div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-medium text-white mb-1">{charm.name}</h3>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: cosmicColor }}>
            {category}
          </span>
          {isRare && <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-600 text-white">✧ Rare ✧</span>}
        </div>

        <div className="text-center mb-3">
          <div className="text-sm text-white/90 font-medium">
            House {houseInfo.houseNumber}: {houseInfo.houseKeyword}
          </div>
          <div className="text-xs text-white/60">{houseInfo.houseName}</div>
        </div>

        <p className="text-sm text-white/80 text-center leading-relaxed">{charm.description}</p>
      </div>
    </motion.div>
  )
}
