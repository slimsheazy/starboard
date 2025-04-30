"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { Charm } from "@/lib/types"
import { X } from "lucide-react"
import { getCharmIcon } from "@/lib/charm-icons"
import { getCharmColor } from "@/lib/charm-colors"

interface CharmTooltipProps {
  charm: Charm
  position: { x: number; y: number }
  onClose: () => void
}

export function CharmTooltip({ charm, position, onClose }: CharmTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const CharmIcon = getCharmIcon(charm.name)

  // Get charm color based on its category
  const { colorClass, lightColor, darkColor, category } = getCharmColor(charm.name)

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
    x: Math.min(position.x, window.innerWidth - 280),
    y: Math.min(position.y, window.innerHeight - 200),
  }

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 w-64 bg-black/90 border border-white/20 rounded-lg shadow-lg p-4"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        transform: "translate(-50%, -120%)",
      }}
    >
      <button onClick={onClose} className="absolute top-2 right-2 text-white/60 hover:text-white">
        <X size={16} />
      </button>

      <div className="flex flex-col items-center">
        <div
          className={`mb-2 p-2 rounded-full flex items-center justify-center ${isRare ? "charm-rare" : "charm-common"}`}
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

          {/* Sparkle effect for rare charms */}
          {isRare && (
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute w-full h-full animate-pulse opacity-50 bg-gradient-to-br from-yellow-200 to-transparent"></div>
            </div>
          )}
        </div>
        <h3 className="text-lg font-medium text-white mb-1">{charm.name}</h3>
        <div className="text-xs mb-1">
          <span
            className={`px-2 py-0.5 rounded-full ${colorClass.replace("from-", "bg-").replace("-200", "-500")} text-white`}
          >
            {category}
          </span>
        </div>
        <div className="text-xs text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)] mb-3">
          {isRare ? "✧ Rare Charm ✧" : "Charm"}
        </div>
        <p className="text-sm text-white/80 text-center">{charm.description}</p>
      </div>
    </motion.div>
  )
}
