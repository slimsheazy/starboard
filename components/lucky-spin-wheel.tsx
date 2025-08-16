"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type { Mesh } from "three"
import confetti from "canvas-confetti"
import { X, Sparkles } from "lucide-react"
import { triggerFlintStrike, triggerGlitch, triggerWhisper } from "./sound-effects"

interface Fortune {
  id: string
  text: string
  category: "love" | "career" | "health" | "wisdom" | "prosperity"
}

const fortunes: Fortune[] = [
  { id: "1", text: "New opportunities await in your professional journey", category: "career" },
  { id: "2", text: "A meaningful connection will strengthen your relationships", category: "love" },
  { id: "3", text: "Your intuition will guide you to the right decision", category: "wisdom" },
  { id: "4", text: "Focus on balance will improve your well-being", category: "health" },
  { id: "5", text: "Financial stability comes through careful planning", category: "prosperity" },
  { id: "6", text: "Creative expression will bring unexpected rewards", category: "career" },
  { id: "7", text: "Trust in yourself will overcome current challenges", category: "wisdom" },
  { id: "8", text: "Small acts of kindness will return to you multiplied", category: "love" },
]

function SpinWheel3D({ isSpinning, rotation }: { isSpinning: boolean; rotation: number }) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current && isSpinning) {
      meshRef.current.rotation.z = rotation
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[3, 3, 0.2, 8]} />
        <meshStandardMaterial color="#4c1d95" />
      </mesh>

      {/* Wheel segments */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 0, 0.11]} rotation={[0, 0, (i * Math.PI) / 4]}>
          <cylinderGeometry args={[3, 3, 0.01, 8, 1, false, 0, Math.PI / 4]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#7c3aed" : "#a855f7"} />
        </mesh>
      ))}

      {/* Center hub */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Pointer */}
      <mesh position={[0, 3.2, 0.2]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.2, 0.4, 3]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  )
}

interface LuckySpinWheelProps {
  onClose: () => void
}

export default function LuckySpinWheel({ onClose }: LuckySpinWheelProps) {
  const [canSpin, setCanSpin] = useState(true)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null)
  const [rotation, setRotation] = useState(0)
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(null)

  useEffect(() => {
    checkSpinAvailability()
  }, [])

  const checkSpinAvailability = async () => {
    const today = new Date().toDateString()
    const lastSpin = localStorage.getItem("lastSpinDate")

    if (lastSpin === today) {
      setCanSpin(false)
      setLastSpinDate(lastSpin)
    }
  }

  const triggerHapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }
  }

  const spinWheel = async () => {
    if (!canSpin || isSpinning) return

    console.log("Spinning the lucky wheel...")
    triggerHapticFeedback()
    triggerGlitch()
    setIsSpinning(true)

    // Random spin duration and final position
    const spinDuration = 3000 + Math.random() * 2000
    const finalRotation = rotation + Math.PI * 8 + Math.random() * Math.PI * 2

    // Animate rotation
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / spinDuration, 1)

      // Easing function for natural deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setRotation(rotation + (finalRotation - rotation) * easeOut)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Determine winning fortune
        const segmentAngle = (Math.PI * 2) / 8
        const normalizedRotation = ((finalRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        const winningIndex = Math.floor((Math.PI * 2 - normalizedRotation + segmentAngle / 2) / segmentAngle) % 8

        const selectedFortune = fortunes[winningIndex]
        console.log("Fortune selected:", selectedFortune.text)
        setCurrentFortune(selectedFortune)
        setIsSpinning(false)

        // Save spin data
        const today = new Date().toDateString()
        localStorage.setItem("lastSpinDate", today)
        setLastSpinDate(today)
        setCanSpin(false)

        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7c3aed", "#a855f7", "#fbbf24"],
        })

        triggerFlintStrike()

        // Save fortune to localStorage
        saveFortune(selectedFortune)
      }
    }

    animate()
  }

  const saveFortune = (fortune: Fortune) => {
    try {
      const existingFortunes = localStorage.getItem("starboard_fortunes")
      const fortunes = existingFortunes ? JSON.parse(existingFortunes) : []

      const newFortune = {
        id: Date.now().toString(),
        fortune_text: fortune.text,
        category: fortune.category,
        spin_date: new Date().toISOString(),
      }

      fortunes.unshift(newFortune)
      localStorage.setItem("starboard_fortunes", JSON.stringify(fortunes))
      console.log("Fortune saved to localStorage")
    } catch (error) {
      console.error("Error saving fortune:", error)
    }
  }

  const handleClose = () => {
    console.log("Closing lucky spin wheel")
    onClose()
    triggerWhisper()
  }

  const getTimeUntilMidnight = () => {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0) // Next midnight

    const diff = midnight.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      love: "text-pink-400",
      career: "text-blue-400",
      health: "text-green-400",
      wisdom: "text-purple-400",
      prosperity: "text-yellow-400",
    }
    return colors[category as keyof typeof colors] || "text-white"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black/80 border-2 border-white/20 rounded-2xl p-6 w-full max-w-md relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-light tracking-wide text-white mb-2">Lucky Spin</h2>
          <p className="text-sm text-white/70">One spin per day • Resets at midnight CDT</p>
        </div>

        {/* 3D Wheel */}
        <div className="h-64 mb-6 rounded-lg overflow-hidden bg-gradient-to-b from-purple-900/20 to-black/40">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <SpinWheel3D isSpinning={isSpinning} rotation={rotation} />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Fortune Display */}
        <AnimatePresence>
          {currentFortune && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`w-4 h-4 ${getCategoryColor(currentFortune.category)}`} />
                <span className={`text-sm font-medium capitalize ${getCategoryColor(currentFortune.category)}`}>
                  {currentFortune.category}
                </span>
              </div>
              <p className="text-white text-sm leading-relaxed">{currentFortune.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spin Button */}
        <div className="text-center">
          {canSpin ? (
            <button
              onClick={() => {
                console.log("Spin wheel button clicked")
                spinWheel()
              }}
              disabled={isSpinning}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full font-medium transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isSpinning ? "Spinning..." : "Spin the Wheel"}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-white/60 text-sm mb-2">Next spin available in:</p>
              <p className="text-purple-400 font-medium">{getTimeUntilMidnight()}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
