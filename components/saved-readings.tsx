"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { SavedReading } from "@/lib/types"
import { getCharmIcon } from "@/lib/charm-icons"
import { TrashIcon, DownloadIcon, EditIcon } from "./cosmic-icons"
import { generateReadingPDF } from "@/lib/pdf-utils"
import { triggerFlintStrike, triggerWhisper } from "./sound-effects"

interface SavedReadingsProps {
  readings: SavedReading[]
  onClose: () => void
  onDelete: (id: string) => void
  onLoad: (reading: SavedReading) => void
  onRename: (id: string, name: string) => void
}

export default function SavedReadings({ readings, onClose, onDelete, onLoad, onRename }: SavedReadingsProps) {
  const [expandedReading, setExpandedReading] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState<string>("")

  const toggleExpand = (id: string) => {
    console.log("Toggling expand for reading:", id)
    if (expandedReading === id) {
      setExpandedReading(null)
    } else {
      setExpandedReading(id)
    }
  }

  const handleSaveAsPDF = (reading: SavedReading) => {
    console.log("Saving reading as PDF:", reading.id)
    generateReadingPDF(reading.question, reading.charms, reading.houses, new Date(reading.date))
    triggerFlintStrike()
  }

  const startEditing = (id: string, currentName: string) => {
    console.log("Starting edit for reading:", id)
    setEditingId(id)
    setEditName(currentName || "")
  }

  const saveReadingName = (id: string) => {
    console.log("Saving reading name:", id, editName)
    onRename(id, editName)
    setEditingId(null)
    triggerFlintStrike()
  }

  const handleDelete = (id: string) => {
    console.log("Deleting reading:", id)
    onDelete(id)
    triggerWhisper()
  }

  const handleLoad = (reading: SavedReading) => {
    console.log("Loading reading:", reading.id)
    onLoad(reading)
  }

  const handleClose = () => {
    console.log("Closing saved readings")
    onClose()
    triggerWhisper()
  }

  const getCosmicColor = (charmName: string): string => {
    const charCode = charmName.charCodeAt(0)
    if (charCode % 4 === 0) return "var(--color-deep-purple)"
    if (charCode % 4 === 1) return "var(--color-neon-pink)"
    if (charCode % 4 === 2) return "var(--color-acid-green)"
    return "var(--color-cosmic-blue)"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="z-10 w-full max-w-md px-4"
    >
      <div className="bg-black/60 border-2 border-white/20 rounded-lg p-4">
        <h2 className="text-lg font-medium text-white mb-4 text-center">Saved Readings</h2>

        {readings.length === 0 ? (
          <p className="text-center text-white/60 py-4">No saved readings yet</p>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 charm-list">
            {readings.map((reading) => (
              <div key={reading.id} className="border-2 border-white/10 rounded-lg p-3 bg-black/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="cursor-pointer flex-1" onClick={() => toggleExpand(reading.id)}>
                    {editingId === reading.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-black/50 border-2 border-white/30 rounded px-2 py-1 text-sm text-white w-full"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveReadingName(reading.id)
                            if (e.key === "Escape") setEditingId(null)
                          }}
                        />
                        <button
                          onClick={() => saveReadingName(reading.id)}
                          className="bg-white/10 hover:bg-white/20 rounded p-1"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-white/80 font-medium">
                            {reading.name || new Date(reading.date).toLocaleDateString()}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditing(reading.id, reading.name || "")
                            }}
                            className="text-white/40 hover:text-white/70 transition-colors"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-white/50">
                          {new Date(reading.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {reading.question && <p className="text-xs text-white/60 italic mt-1">"{reading.question}"</p>}
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(reading.id)}
                    className="text-white/40 hover:text-white/70 transition-colors p-1"
                    aria-label="Delete reading"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {reading.charms.slice(0, 5).map((charm, idx) => {
                    const CharmIcon = getCharmIcon(charm.name)
                    const cosmicColor = getCosmicColor(charm.name)
                    const isRare = charm.rarity === "rare"

                    return (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${isRare ? "charm-rare-2d" : "charm-2d"}`}
                        style={{
                          backgroundColor: cosmicColor,
                          transform: "scale(0.8)",
                        }}
                        title={charm.name}
                      >
                        <CharmIcon className="w-3 h-3 text-white" />
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoad(reading)}
                        className="flex-1 py-2 rounded-lg transition-colors bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center gap-1"
                      >
                        Load Reading
                      </button>
                      <button
                        onClick={() => handleSaveAsPDF(reading)}
                        className="flex-1 py-2 rounded-lg transition-colors bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center gap-1"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        Save as PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleClose}
          className="mt-4 px-6 py-2 border-2 border-white/20 rounded-full text-sm hover:bg-white/5 transition-colors mx-auto block"
        >
          back
        </button>
      </div>
    </motion.div>
  )
}
