"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { triggerFlintStrike, triggerWhisper } from "./sound-effects"
import type { SavedReading } from "@/lib/types"
import { generateReadingPDF } from "@/lib/pdf-utils"
import { getCharmIcon } from "@/lib/charm-icons"
import { getCharmColor } from "@/lib/charm-colors"

interface SavedReadingsProps {
  readings: SavedReading[]
  onClose: () => void
  onDelete: (id: string) => void
  onLoad: (reading: SavedReading) => void
  onRename: (id: string, name: string) => void
}

export default function SavedReadings({ readings, onClose, onDelete, onLoad, onRename }: SavedReadingsProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const handleRename = (reading: SavedReading) => {
    console.log("Starting rename for:", reading.id)
    setEditingId(reading.id)
    setEditName(reading.name || "")
  }

  const handleSaveRename = (id: string) => {
    console.log("Saving rename:", id, editName)
    triggerFlintStrike()
    onRename(id, editName)
    setEditingId(null)
    setEditName("")
  }

  const handleCancelRename = () => {
    console.log("Canceling rename")
    setEditingId(null)
    setEditName("")
  }

  const handleDelete = (id: string) => {
    console.log("Deleting reading:", id)
    triggerWhisper()
    onDelete(id)
  }

  const handleLoad = (reading: SavedReading) => {
    console.log("Loading reading:", reading.id)
    onLoad(reading)
  }

  const handleExportPDF = (reading: SavedReading) => {
    console.log("Exporting reading as PDF:", reading.id)
    triggerFlintStrike()
    generateReadingPDF(reading.question, reading.charms, reading.houses)
  }

  const handleClose = () => {
    console.log("Closing saved readings")
    triggerWhisper()
    onClose()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black/90 border border-white/20 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light tracking-wide">Saved Readings</h2>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {readings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Saved Readings</h3>
            <p className="text-white/70">Cast some charms and save your readings to see them here.</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh] space-y-4">
            <AnimatePresence>
              {readings.map((reading) => (
                <motion.div
                  key={reading.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {editingId === reading.id ? (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-black/30 border border-white/20 rounded px-2 py-1 text-sm text-white flex-1"
                            placeholder="Enter reading name..."
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(reading.id)}
                            className="text-green-400 hover:text-green-300 text-sm"
                          >
                            Save
                          </button>
                          <button onClick={handleCancelRename} className="text-red-400 hover:text-red-300 text-sm">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-white">
                            {reading.name || `Reading ${reading.id.slice(-4)}`}
                          </h3>
                          <button
                            onClick={() => handleRename(reading)}
                            className="text-white/50 hover:text-white/70 text-xs"
                          >
                            rename
                          </button>
                        </div>
                      )}
                      <p className="text-sm text-white/70 mb-2">"{reading.question}"</p>
                      <p className="text-xs text-white/50">{formatDate(reading.date)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleLoad(reading)}
                        className="px-3 py-1 bg-purple-600/20 border border-purple-400/30 rounded text-xs text-purple-300 hover:bg-purple-600/30 transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleExportPDF(reading)}
                        className="px-3 py-1 bg-blue-600/20 border border-blue-400/30 rounded text-xs text-blue-300 hover:bg-blue-600/30 transition-colors"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleDelete(reading.id)}
                        className="px-3 py-1 bg-red-600/20 border border-red-400/30 rounded text-xs text-red-300 hover:bg-red-600/30 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Charm preview */}
                  <div className="flex flex-wrap gap-2">
                    {reading.charms.slice(0, 8).map((charm, index) => {
                      const CharmIcon = getCharmIcon(charm.name)
                      const charmColor = getCharmColor(charm.rarity)
                      return (
                        <div
                          key={`${charm.name}-${index}`}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${charmColor.bg} ${charmColor.border} border`}
                          title={charm.name}
                        >
                          <CharmIcon className={`w-3 h-3 ${charmColor.text}`} />
                        </div>
                      )
                    })}
                    {reading.charms.length > 8 && (
                      <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="text-xs text-white/70">+{reading.charms.length - 8}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
