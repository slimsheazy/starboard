"use client"

import { useState, useEffect, useRef } from "react"
import { SoundIcon, MuteIcon } from "./cosmic-icons"

interface SoundEffectsProps {
  className?: string
}

export default function SoundEffects({ className }: SoundEffectsProps) {
  const [isMuted, setIsMuted] = useState(true)
  const flintStrikeRef = useRef<HTMLAudioElement | null>(null)
  const whisperRef = useRef<HTMLAudioElement | null>(null)
  const glitchRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio elements
    flintStrikeRef.current = new Audio("/sounds/flint-strike.mp3")
    whisperRef.current = new Audio("/sounds/whisper.mp3")
    glitchRef.current = new Audio("/sounds/glitch.mp3")

    // Set up event listeners for custom events
    document.addEventListener("play-flint-strike", playFlintStrike)
    document.addEventListener("play-whisper", playWhisper)
    document.addEventListener("play-glitch", playGlitch)

    return () => {
      // Clean up event listeners
      document.removeEventListener("play-flint-strike", playFlintStrike)
      document.removeEventListener("play-whisper", playWhisper)
      document.removeEventListener("play-glitch", playGlitch)
    }
  }, [])

  // Sound effect functions
  const playFlintStrike = () => {
    if (!isMuted && flintStrikeRef.current) {
      flintStrikeRef.current.currentTime = 0
      flintStrikeRef.current.play().catch((e) => console.log("Audio play error:", e))
    }
  }

  const playWhisper = () => {
    if (!isMuted && whisperRef.current) {
      whisperRef.current.currentTime = 0
      whisperRef.current.play().catch((e) => console.log("Audio play error:", e))
    }
  }

  const playGlitch = () => {
    if (!isMuted && glitchRef.current) {
      glitchRef.current.currentTime = 0
      glitchRef.current.play().catch((e) => console.log("Audio play error:", e))
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className={`${className || ""}`}>
      <button
        onClick={toggleMute}
        className="p-2 rounded-full bg-black/30 border-2 border-white/20 hover:border-white/40 transition-colors"
        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
      >
        {isMuted ? <MuteIcon className="w-5 h-5 text-white/70" /> : <SoundIcon className="w-5 h-5 text-white" />}
      </button>
    </div>
  )
}

// Helper functions to trigger sounds from anywhere in the app
export const triggerFlintStrike = () => {
  document.dispatchEvent(new Event("play-flint-strike"))
}

export const triggerWhisper = () => {
  document.dispatchEvent(new Event("play-whisper"))
}

export const triggerGlitch = () => {
  document.dispatchEvent(new Event("play-glitch"))
}
