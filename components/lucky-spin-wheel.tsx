"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { XIcon, Sparkles } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface LuckySpinWheelProps {
  onClose: () => void
  onSpinComplete: (result: string) => void
}

const fortunes = [
  "A new opportunity will arise soon.",
  "Trust your intuition; it will guide you well.",
  "Unexpected joy is on its way.",
  "Challenges will lead to growth.",
  "A long-held wish is about to manifest.",
  "Patience is key to your current situation.",
  "Seek wisdom from an elder or mentor.",
  "A creative breakthrough is imminent.",
  "Financial abundance is within reach.",
  "Connect with nature for clarity.",
]

export function LuckySpinWheel({ onClose, onSpinComplete }: LuckySpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const { isAuthenticated } = useAuth()
  const wheelRef = useRef<HTMLDivElement>(null)

  const spinWheel = () => {
    if (!isAuthenticated) {
      alert("Please sign in to use the Lucky Spin Wheel!")
      return
    }

    setIsSpinning(true)
    setResult(null)

    const randomIndex = Math.floor(Math.random() * fortunes.length)
    const degreesPerFortune = 360 / fortunes.length
    const targetRotation = 360 * 5 + (fortunes.length - randomIndex) * degreesPerFortune // Spin multiple times + target

    setRotation(targetRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setResult(fortunes[randomIndex])
      onSpinComplete(fortunes[randomIndex])
    }, 4000) // Match this with CSS transition duration
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="w-full max-w-md bg-black/90 border-2 border-white/20 rounded-lg shadow-lg p-6 text-white relative"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-3 right-3 text-white/70 hover:text-white"
      >
        <XIcon className="w-6 h-6" />
      </Button>

      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <Sparkles className="w-7 h-7 text-yellow-400" />
        Lucky Spin Wheel
      </h2>

      <div className="relative w-64 h-64 mx-auto mb-8">
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full border-4 border-yellow-400 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center transition-transform duration-[4000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {fortunes.map((fortune, index) => (
            <div
              key={index}
              className="absolute text-xs font-medium text-center"
              style={{
                transform: `rotate(${index * (360 / fortunes.length)}deg) translate(0, -100px) rotate(-${index * (360 / fortunes.length)}deg)`,
                width: "100px",
                height: "20px",
                lineHeight: "20px",
                transformOrigin: "50% 150px",
              }}
            >
              {fortune.substring(0, 15)}...
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-yellow-400 z-10" />
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 border border-white/20 p-4 rounded-lg mb-6"
        >
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">Your Fortune:</h3>
          <p className="text-white text-xl italic">"{result}"</p>
        </motion.div>
      )}

      <Button
        onClick={spinWheel}
        disabled={isSpinning || !isAuthenticated}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2"
      >
        {isSpinning ? (
          <>
            <Sparkles className="w-5 h-5 animate-spin" /> Spinning...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" /> Spin for Fortune
          </>
        )}
      </Button>
      {!isAuthenticated && <p className="text-center text-sm text-white/70 mt-2">Sign in to save your fortunes!</p>}
    </motion.div>
  )
}
