"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import StarBackground from "@/components/star-background"
import AstrologyWheel from "@/components/astrology-wheel"
import UserInputForm from "@/components/user-input-form"
import CharmBoard from "@/components/charm-board"
import ReadingSynopsis from "@/components/reading-synopsis"
import SavedReadings from "@/components/saved-readings"
import BottomNav from "@/components/bottom-nav"
import LuckySpinWheel from "@/components/lucky-spin-wheel"
import { triggerFlintStrike, triggerGlitch, triggerWhisper } from "@/components/sound-effects"
import useShakeDetection from "@/hooks/use-shake-detection"
import type { Charm, House, SavedReading } from "@/lib/types"
import { houses as defaultHouses } from "@/lib/houses"
import { charms } from "@/lib/charms"
import { getRandomCharms } from "@/lib/utils"
import { getContextualHouses } from "@/lib/house-context"
import { SaveIcon, DownloadIcon, CheckIcon } from "@/components/cosmic-icons"
import { generateReadingPDF } from "@/lib/pdf-utils"

export default function Home() {
  const [question, setQuestion] = useState<string>("")
  const [selectedCharms, setSelectedCharms] = useState<Charm[]>([])
  const [isReading, setIsReading] = useState(false)
  const [hasShaken, setHasShaken] = useState(false)
  const [contextualHouses, setContextualHouses] = useState<House[]>(defaultHouses)
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>([])
  const [showSavedReadings, setShowSavedReadings] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null)
  const [showSpinWheel, setShowSpinWheel] = useState(false)

  // Load saved readings from localStorage on initial render
  useEffect(() => {
    const savedReadingsData = localStorage.getItem("starboardSavedReadings")
    if (savedReadingsData) {
      try {
        setSavedReadings(JSON.parse(savedReadingsData))
      } catch (e) {
        console.error("Error loading saved readings:", e)
      }
    }
  }, [])

  // Update contextual houses when question changes
  useEffect(() => {
    if (question) {
      setContextualHouses(getContextualHouses(question))
    } else {
      setContextualHouses(defaultHouses)
    }
  }, [question])

  // Reset save success message after 3 seconds
  useEffect(() => {
    if (saveSuccess !== null) {
      const timer = setTimeout(() => {
        setSaveSuccess(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  // Handle shake detection
  const onShake = () => {
    if (!hasShaken) {
      console.log("Shake detected - casting charms")
      castCharms()
      setHasShaken(true)
    }
  }

  useShakeDetection(onShake, true)

  const castCharms = () => {
    console.log("Casting charms...")
    // Play sound effect
    triggerGlitch()

    // Get current date for astrological calculations
    const currentDate = new Date()

    // Get lunar phase (simplified for demo)
    const lunarDay = currentDate.getDate() % 30

    // Select random charms based on inputs
    const randomCharms = getRandomCharms(charms, 12, {
      question,
      lunarPhase: lunarDay,
    })

    setSelectedCharms(randomCharms)
    setIsReading(true)
  }

  const resetReading = () => {
    console.log("Resetting reading...")
    triggerWhisper()
    setSelectedCharms([])
    setIsReading(false)
    setHasShaken(false)
  }

  // Save the current reading
  const saveReading = () => {
    console.log("Saving reading...")
    triggerFlintStrike()

    const newReading: SavedReading = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      question: question,
      charms: selectedCharms,
      houses: contextualHouses,
      name: "",
    }

    const updatedReadings = [...savedReadings, newReading]
    setSavedReadings(updatedReadings)

    // Save to localStorage
    localStorage.setItem("starboardSavedReadings", JSON.stringify(updatedReadings))

    // Show success message
    setSaveSuccess(true)
  }

  // Save the current reading as PDF
  const saveReadingAsPDF = () => {
    console.log("Saving reading as PDF...")
    triggerFlintStrike()
    generateReadingPDF(question, selectedCharms, contextualHouses)
  }

  // Delete a saved reading
  const deleteReading = (id: string) => {
    console.log("Deleting reading:", id)
    triggerWhisper()
    const updatedReadings = savedReadings.filter((reading) => reading.id !== id)
    setSavedReadings(updatedReadings)

    // Update localStorage
    localStorage.setItem("starboardSavedReadings", JSON.stringify(updatedReadings))
  }

  // Rename a saved reading
  const renameReading = (id: string, name: string) => {
    console.log("Renaming reading:", id, name)
    triggerFlintStrike()
    const updatedReadings = savedReadings.map((reading) => (reading.id === id ? { ...reading, name } : reading))
    setSavedReadings(updatedReadings)

    // Update localStorage
    localStorage.setItem("starboardSavedReadings", JSON.stringify(updatedReadings))
  }

  // Load a saved reading
  const loadReading = (reading: SavedReading) => {
    console.log("Loading reading:", reading.id)
    triggerGlitch()
    setQuestion(reading.question)
    setSelectedCharms(reading.charms)
    setContextualHouses(reading.houses)
    setIsReading(true)
    setShowSavedReadings(false)
  }

  // Toggle saved readings view
  const toggleSavedReadings = () => {
    console.log("Toggling saved readings view")
    triggerWhisper()
    setShowSavedReadings(!showSavedReadings)
  }

  // Toggle spin wheel
  const toggleSpinWheel = () => {
    console.log("Toggling spin wheel")
    triggerWhisper()
    setShowSpinWheel(!showSpinWheel)
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white overflow-hidden pb-20">
      <StarBackground />

      <h1 className="text-2xl font-extralight tracking-widest mb-6 z-10">starboard</h1>

      <AnimatePresence mode="wait">
        {showSpinWheel ? (
          <LuckySpinWheel onClose={() => setShowSpinWheel(false)} />
        ) : !isReading && !showSavedReadings ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 w-full max-w-md px-4"
          >
            <UserInputForm question={question} setQuestion={setQuestion} onSubmit={castCharms} />

            <div className="mt-8 text-center text-sm text-white/70">
              <p>Shake your device to cast the charms</p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    console.log("Lucky spin button clicked")
                    toggleSpinWheel()
                  }}
                  className="px-6 py-2 rounded-full text-sm transition-colors bg-black/30 border-2 border-acid-green hover:bg-acid-green/10 sound-trigger"
                >
                  lucky spin
                </button>
              </div>
            </div>
          </motion.div>
        ) : showSavedReadings ? (
          <SavedReadings
            readings={savedReadings}
            onClose={toggleSavedReadings}
            onDelete={deleteReading}
            onLoad={loadReading}
            onRename={renameReading}
          />
        ) : (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 w-full flex flex-col items-center"
          >
            <div className="relative w-full max-w-md aspect-square mx-auto">
              <AstrologyWheel houses={contextualHouses} />
              <CharmBoard charms={selectedCharms} houses={contextualHouses} />
            </div>

            <p className="text-xs text-white/50 mt-2 text-center">tap the charms for insight</p>

            {question && (
              <div className="mt-2 text-center max-w-md px-4">
                <p className="text-sm text-white/70 italic">"{question}"</p>
              </div>
            )}

            <ReadingSynopsis charms={selectedCharms} houses={contextualHouses} question={question} />

            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              <button
                onClick={() => {
                  console.log("Save reading button clicked")
                  saveReading()
                }}
                className="px-6 py-2 border-2 border-white/30 rounded-full text-sm hover:bg-white/10 transition-colors tracking-wide flex items-center gap-2 relative sound-trigger"
                disabled={saveSuccess === true}
              >
                {saveSuccess === true ? (
                  <>
                    <CheckIcon className="w-5 h-5 text-acid-green" />
                    saved
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-5 h-5" />
                    save reading
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  console.log("Save as PDF button clicked")
                  saveReadingAsPDF()
                }}
                className="px-6 py-2 border-2 border-white/30 rounded-full text-sm hover:bg-white/10 transition-colors tracking-wide flex items-center gap-2 sound-trigger"
              >
                <DownloadIcon className="w-5 h-5" />
                save as PDF
              </button>

              <button
                onClick={() => {
                  console.log("New reading button clicked")
                  resetReading()
                }}
                className="px-6 py-2 border-2 border-white/30 rounded-full text-sm hover:bg-white/10 transition-colors tracking-wide sound-trigger"
              >
                new reading
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav onOpenSavedReadings={toggleSavedReadings} savedReadingsCount={savedReadings.length} />
    </main>
  )
}
