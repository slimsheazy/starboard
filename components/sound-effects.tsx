"use client"

import { useState, useEffect, useRef } from "react"
import { SoundIcon, MuteIcon } from "./cosmic-icons"

interface SoundEffectsProps {
  className?: string
}

export default function SoundEffects({ className }: SoundEffectsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const flintStrikeRef = useRef<HTMLAudioElement | null>(null)
  const whisperRef = useRef<HTMLAudioElement | null>(null)
  const glitchRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Function to safely create audio elements with fallback
    const createAudioWithFallback = (src: string) => {
      const audio = new Audio()
      audio.volume = 0.7

      // Try to load the audio file, but don't break if it fails
      try {
        audio.src = src
        // Add error handling for the audio element
        audio.addEventListener("error", (e) => {
          console.warn(`Could not load audio file: ${src}`, e)
        })
      } catch (e) {
        console.warn(`Error setting up audio: ${src}`, e)
      }

      return audio
    }

    // Create audio elements with proper error handling
    flintStrikeRef.current = createAudioWithFallback("/sounds/flint-strike.mp3")
    whisperRef.current = createAudioWithFallback("/sounds/whisper.mp3")
    glitchRef.current = createAudioWithFallback("/sounds/glitch.mp3")

    // Set up event listeners for custom events
    document.addEventListener("play-flint-strike", playFlintStrike)
    document.addEventListener("play-whisper", playWhisper)
    document.addEventListener("play-glitch", playGlitch)

    // Log a warning if sounds directory might be missing
    console.info(
      "Sound effects initialized. If you're not hearing sounds, make sure audio files exist in the /public/sounds/ directory.",
    )

    return () => {
      // Clean up event listeners
      document.removeEventListener("play-flint-strike", playFlintStrike)
      document.removeEventListener("play-whisper", playWhisper)
      document.removeEventListener("play-glitch", playGlitch)
    }
  }, [])

  // Sound effect functions with better error handling
  const playFlintStrike = () => {
    if (isMuted || !flintStrikeRef.current) return

    try {
      flintStrikeRef.current.currentTime = 0
      const playPromise = flintStrikeRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Could not play flint strike sound:", error)
        })
      }
    } catch (e) {
      console.warn("Error playing flint strike sound:", e)
    }
  }

  const playWhisper = () => {
    if (isMuted || !whisperRef.current) return

    try {
      whisperRef.current.currentTime = 0
      const playPromise = whisperRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Could not play whisper sound:", error)
        })
      }
    } catch (e) {
      console.warn("Error playing whisper sound:", e)
    }
  }

  const playGlitch = () => {
    if (isMuted || !glitchRef.current) return

    try {
      glitchRef.current.currentTime = 0
      const playPromise = glitchRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Could not play glitch sound:", error)
        })
      }
    } catch (e) {
      console.warn("Error playing glitch sound:", e)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className={`${className || ""}`}>
      <button
        onClick={toggleMute}
        className={`p-2 rounded-full ${isMuted ? "bg-black/30 border-2 border-white/20" : "bg-neon-pink/30 border-2 border-neon-pink"} hover:border-white/40 transition-colors`}
        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
        title={isMuted ? "Unmute sounds (requires audio files in /public/sounds/)" : "Mute sounds"}
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
