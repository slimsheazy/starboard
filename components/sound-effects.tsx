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
  const combinationRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Function to safely create audio elements with better error handling
    const createAudioWithFallback = (src: string) => {
      const audio = new Audio()
      audio.volume = 0.7
      audio.preload = "auto" // Preload the audio files

      // Try to load the audio file
      try {
        audio.src = src

        // Add load event listener for successful loading
        audio.addEventListener("canplaythrough", () => {
          console.log(`✓ Audio file loaded successfully: ${src}`)
        })

        // Add error handling for the audio element
        audio.addEventListener("error", (e) => {
          console.warn(`✗ Could not load audio file: ${src}`, e)
        })

        // Attempt to load the audio
        audio.load()
      } catch (e) {
        console.warn(`✗ Error setting up audio: ${src}`, e)
      }

      return audio
    }

    // Create audio elements with proper error handling
    flintStrikeRef.current = createAudioWithFallback("/sounds/flint-strike.mp3")
    whisperRef.current = createAudioWithFallback("/sounds/whisper.mp3")
    glitchRef.current = createAudioWithFallback("/sounds/glitch.mp3")
    combinationRef.current = createAudioWithFallback("/sounds/glitch.mp3") // We'll use glitch for combinations for now

    // Set up event listeners for custom events
    document.addEventListener("play-flint-strike", playFlintStrike)
    document.addEventListener("play-whisper", playWhisper)
    document.addEventListener("play-glitch", playGlitch)
    document.addEventListener("play-combination", playCombination)

    // Log success message
    console.info("🔊 Sound effects initialized. Audio files should load from /public/sounds/")

    return () => {
      // Clean up event listeners
      document.removeEventListener("play-flint-strike", playFlintStrike)
      document.removeEventListener("play-whisper", playWhisper)
      document.removeEventListener("play-glitch", playGlitch)
      document.removeEventListener("play-combination", playCombination)
    }
  }, [])

  // Sound effect functions with better error handling and user interaction support
  const playFlintStrike = () => {
    if (isMuted || !flintStrikeRef.current) return

    try {
      flintStrikeRef.current.currentTime = 0
      const playPromise = flintStrikeRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("🔥 Flint strike sound played successfully")
          })
          .catch((error) => {
            // Handle autoplay restrictions
            if (error.name === "NotAllowedError") {
              console.info("🔇 Audio autoplay blocked by browser. User interaction required.")
            } else {
              console.warn("Could not play flint strike sound:", error)
            }
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
        playPromise
          .then(() => {
            console.log("👻 Whisper sound played successfully")
          })
          .catch((error) => {
            if (error.name === "NotAllowedError") {
              console.info("🔇 Audio autoplay blocked by browser. User interaction required.")
            } else {
              console.warn("Could not play whisper sound:", error)
            }
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
        playPromise
          .then(() => {
            console.log("⚡ Glitch sound played successfully")
          })
          .catch((error) => {
            if (error.name === "NotAllowedError") {
              console.info("🔇 Audio autoplay blocked by browser. User interaction required.")
            } else {
              console.warn("Could not play glitch sound:", error)
            }
          })
      }
    } catch (e) {
      console.warn("Error playing glitch sound:", e)
    }
  }

  const playCombination = () => {
    if (isMuted || !combinationRef.current) return

    try {
      combinationRef.current.currentTime = 0
      combinationRef.current.volume = 0.9 // Slightly louder for combinations
      const playPromise = combinationRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("✨ Combination sound played successfully")
          })
          .catch((error) => {
            if (error.name === "NotAllowedError") {
              console.info("🔇 Audio autoplay blocked by browser. User interaction required.")
            } else {
              console.warn("Could not play combination sound:", error)
            }
          })
      }
    } catch (e) {
      console.warn("Error playing combination sound:", e)
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
        title={isMuted ? "Unmute sounds" : "Mute sounds (click any button to enable audio)"}
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

export const triggerCombination = () => {
  document.dispatchEvent(new Event("play-combination"))
}
