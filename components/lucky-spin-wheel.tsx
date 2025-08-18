"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { triggerFlintStrike, triggerGlitch, triggerWhisper } from "./sound-effects"

interface Fortune {
  id: string
  text: string
  date: string
}

interface LuckySpinWheelProps {
  onClose: () => void
}

const fortunes = [
  "A mysterious opportunity awaits you in the shadows",
  "Trust your intuition when the moon is full",
  "Three unexpected messages will guide your path",
  "The answer you seek lies in an old memory",
  "A chance encounter will change your perspective",
  "Look for signs in the patterns around you",
  "Your creativity will unlock a hidden door",
  "The stars align for a bold decision",
  "A forgotten skill will prove invaluable",
  "Listen to the whispers of your dreams",
  "The path forward requires letting go",
  "A small act of kindness will return tenfold",
]

export default function LuckySpinWheel({ onClose }: LuckySpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentFortune, setCurrentFortune] = useState<string | null>(null)
  const [canSpin, setCanSpin] = useState(true)
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState<string>("")
  const wheelRef = useRef<HTMLDivElement>(null)

  // Check if user can spin (once per day)
  useEffect(() => {
    const lastSpinDate = localStorage.getItem("starboard_last_spin")
    if (lastSpinDate) {
      const lastSpin = new Date(lastSpinDate)
      const now = new Date()
      const timeDiff = now.getTime() - lastSpin.getTime()
      const hoursDiff = timeDiff / (1000 * 3600)

      if (hoursDiff < 24) {
        setCanSpin(false)
        const hoursLeft = Math.ceil(24 - hoursDiff)
        setTimeUntilNextSpin(`${hoursLeft} hours`)

        // Update countdown every minute
        const interval = setInterval(() => {
          const newTimeDiff = new Date().getTime() - lastSpin.getTime()
          const newHoursDiff = newTimeDiff / (1000 * 3600)

          if (newHoursDiff >= 24) {
            setCanSpin(true)
            setTimeUntilNextSpin("")
            clearInterval(interval)
          } else {
            const newHoursLeft = Math.ceil(24 - newHoursDiff)
            setTimeUntilNextSpin(`${newHoursLeft} hours`)
          }
        }, 60000)

        return () => clearInterval(interval)
      }
    }
  }, [])

  const handleSpin = () => {
    if (!canSpin || isSpinning) return

    console.log("Spinning wheel...")
    triggerGlitch()
    setIsSpinning(true)

    // Random spin duration between 3-5 seconds
    const spinDuration = 3000 + Math.random() * 2000
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)]

    // Animate the wheel
    if (wheelRef.current) {
      const randomRotation = 1440 + Math.random() * 1440 // 4-8 full rotations
      wheelRef.current.style.transform = `rotate(${randomRotation}deg)`
      wheelRef.current.style.transition = `transform ${spinDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`
    }

    setTimeout(() => {
      console.log("Spin complete, showing fortune:", randomFortune)
      triggerFlintStrike()
      setCurrentFortune(randomFortune)
      setIsSpinning(false)
      setCanSpin(false)

      // Save spin date and fortune
      const now = new Date().toISOString()
      localStorage.setItem("starboard_last_spin", now)

      // Save fortune to localStorage
      const savedFortunes = JSON.parse(localStorage.getItem("starboard_fortunes") || "[]")
      const newFortune: Fortune = {
        id: Date.now().toString(),
        text: randomFortune,
        date: now,
      }
      savedFortunes.push(newFortune)
      localStorage.setItem("starboard_fortunes", JSON.stringify(savedFortunes))

      // Set next spin availability
      setTimeUntilNextSpin("24 hours")
    }, spinDuration)
  }

  const handleClose = () => {
    console.log("Closing spin wheel")
    triggerWhisper()
    onClose()
  }

  const resetWheel = () => {
    setCurrentFortune(null)
    if (wheelRef.current) {
      wheelRef.current.style.transform = "rotate(0deg)"
      wheelRef.current.style.transition = "none"
    }
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
        className="bg-black/90 border border-white/20 rounded-lg p-8 w-full max-w-md text-center"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light tracking-wide">Lucky Spin</h2>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {currentFortune ? (
            <motion.div
              key="fortune"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Your Fortune</h3>
                <p className="text-white/80 italic leading-relaxed">"{currentFortune}"</p>
              </div>
              <button
                onClick={resetWheel}
                className="px-6 py-2 border border-white/30 rounded-full text-sm hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Spinning Wheel */}
              <div className="relative w-48 h-48 mx-auto">
                <div
                  ref={wheelRef}
                  className="w-full h-full rounded-full border-4 border-white/20 relative overflow-hidden"
                  style={{
                    background: `conic-gradient(
                      from 0deg,
                      #ff6b6b 0deg 30deg,
                      #4ecdc4 30deg 60deg,
                      #45b7d1 60deg 90deg,
                      #96ceb4 90deg 120deg,
                      #feca57 120deg 150deg,
                      #ff9ff3 150deg 180deg,
                      #54a0ff 180deg 210deg,
                      #5f27cd 210deg 240deg,
                      #00d2d3 240deg 270deg,
                      #ff9f43 270deg 300deg,
                      #ee5a24 300deg 330deg,
                      #10ac84 330deg 360deg
                    )`,
                  }}
                >
                  {/* Center circle */}
                  <div className="absolute inset-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full border-2 border-gray-800 z-10" />

                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white z-20" />
                </div>
              </div>

              {canSpin ? (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">Spin the wheel for your daily fortune!</p>
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSpinning ? "Spinning..." : "Spin the Wheel"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">You've already spun today!</p>
                  <p className="text-white/50 text-xs">Next spin available in {timeUntilNextSpin}</p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 border border-white/30 rounded-full text-sm hover:bg-white/10 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
