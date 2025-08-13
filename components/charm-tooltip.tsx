"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { Charm } from "@/lib/types"
import { getCharmIcon } from "@/lib/charm-icons"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CharmTooltipProps {
  charm: Charm
  position: { x: number; y: number }
  onClose: () => void
}

export function CharmTooltip({ charm, position, onClose }: CharmTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const CharmIcon = getCharmIcon(charm.name)

  useEffect(() => {
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

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        top: position.y + 60, // Offset from the charm
        left: position.x,
        transform: "translateX(-50%)", // Center horizontally
      }}
      className="fixed z-50 bg-black/95 border-2 border-white/30 rounded-lg shadow-xl p-4 max-w-xs text-white"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-2 right-2 text-white/70 hover:text-white"
      >
        <XIcon className="w-4 h-4" />
      </Button>
      <h3 className="text-lg font-bold mb-2">{charm.name}</h3>
      <p className="text-sm text-white/80 mb-2">{charm.description}</p>
      <p className="text-xs text-white/60">Rarity: {charm.rarity}</p>
    </motion.div>
  )
}
