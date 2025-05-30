"use client"

import { useState, useEffect } from "react"
import { SoundIcon, MuteIcon } from "./cosmic-icons"

interface SoundEffectsProps {
  className?: string
}

interface AudioInstance {
  audio: HTMLAudioElement | null
  loaded: boolean
  error: string | null
}

export default function SoundEffects({ className }: SoundEffectsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [audioInstances, setAudioInstances] = useState<Record<string, AudioInstance>>({})
  const [userInteracted, setUserInteracted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Simplified audio configuration with fallback strategy
  const audioConfigs = {
    flintStrike: {
      name: "Flint Strike",
      files: ["flint-strike.wav", "flint-strike.mp3"],
    },
    whisper: {
      name: "Whisper",
      files: ["whisper.wav", "whisper.mp3"],
    },
    glitch: {
      name: "Glitch",
      files: ["glitch.wav", "glitch.mp3"],
    },
  }

  useEffect(() => {
    initializeAudio()
    setupEventListeners()
    return () => cleanupEventListeners()
  }, [])

  const initializeAudio = async () => {
    const instances: Record<string, AudioInstance> = {}

    for (const [key, config] of Object.entries(audioConfigs)) {
      instances[key] = await createAudioInstance(config.files, config.name)
    }

    setAudioInstances(instances)
    setIsInitialized(true)
  }

  const createAudioInstance = async (files: string[], name: string): Promise<AudioInstance> => {
    // Try each file format until one works
    for (const filename of files) {
      try {
        const audio = new Audio()
        const path = `/sounds/${filename}`

        // Test if the audio can load
        const canLoad = await new Promise<boolean>((resolve) => {
          let resolved = false

          const onLoad = () => {
            if (!resolved) {
              resolved = true
              resolve(true)
            }
          }

          const onError = () => {
            if (!resolved) {
              resolved = true
              resolve(false)
            }
          }

          // Set up event listeners
          audio.addEventListener("canplaythrough", onLoad, { once: true })
          audio.addEventListener("loadeddata", onLoad, { once: true })
          audio.addEventListener("error", onError, { once: true })

          // Timeout after 2 seconds
          setTimeout(() => {
            if (!resolved) {
              resolved = true
              resolve(false)
            }
          }, 2000)

          // Configure and load
          audio.preload = "auto"
          audio.volume = 0.7
          audio.src = path
        })

        if (canLoad) {
          return {
            audio,
            loaded: true,
            error: null,
          }
        }
      } catch (error) {
        // Continue to next format
        continue
      }
    }

    // If no format worked, return a silent instance
    return {
      audio: null,
      loaded: false,
      error: `Could not load ${name}`,
    }
  }

  const setupEventListeners = () => {
    document.addEventListener("play-flint-strike", playFlintStrike)
    document.addEventListener("play-whisper", playWhisper)
    document.addEventListener("play-glitch", playGlitch)
    document.addEventListener("play-combination", playCombination)

    // Detect user interaction for autoplay policy
    const handleUserInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true)
      }
    }

    const events = ["click", "touchstart", "keydown"]
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true })
    })
  }

  const cleanupEventListeners = () => {
    document.removeEventListener("play-flint-strike", playFlintStrike)
    document.removeEventListener("play-whisper", playWhisper)
    document.removeEventListener("play-glitch", playGlitch)
    document.removeEventListener("play-combination", playCombination)
  }

  const playAudio = async (key: string, volumeMultiplier = 1) => {
    if (isMuted || !userInteracted) return

    const instance = audioInstances[key]
    if (!instance?.loaded || !instance.audio) return

    try {
      // Clone the audio to allow overlapping sounds
      const audioClone = instance.audio.cloneNode() as HTMLAudioElement
      audioClone.currentTime = 0
      audioClone.volume = Math.min(1, 0.7 * volumeMultiplier)
      await audioClone.play()
    } catch (error) {
      // Silently fail - don't spam console or show errors to users
    }
  }

  const playFlintStrike = () => playAudio("flintStrike")
  const playWhisper = () => playAudio("whisper")
  const playGlitch = () => playAudio("glitch")
  const playCombination = () => playAudio("glitch", 1.2)

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const getLoadedCount = () => {
    return Object.values(audioInstances).filter((instance) => instance.loaded).length
  }

  const getStatusColor = () => {
    if (!isInitialized) return "text-yellow-400"
    const loadedCount = getLoadedCount()
    if (loadedCount === 0) return "text-red-400"
    if (loadedCount < 3) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className={`${className || ""} relative`}>
      <button
        onClick={toggleMute}
        className={`p-2 rounded-full ${
          isMuted ? "bg-black/30 border-2 border-white/20" : "bg-neon-pink/30 border-2 border-neon-pink"
        } hover:border-white/40 transition-colors`}
        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
        title={`${isMuted ? "Unmute" : "Mute"} sounds`}
      >
        {isMuted ? <MuteIcon className="w-5 h-5 text-white/70" /> : <SoundIcon className="w-5 h-5 text-white" />}
      </button>

      {/* Simple status indicator */}
      <div className={`absolute top-full left-0 mt-1 text-xs ${getStatusColor()} whitespace-nowrap`}>
        {!isInitialized ? "Loading..." : `${getLoadedCount()}/3`}
      </div>
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
