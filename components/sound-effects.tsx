"use client"

import React, { useState, useEffect, useRef } from "react"
import { VolumeX, Volume2 } from 'lucide-react';
import { Howl } from "howler"

interface SoundEffectsProps {
  className?: string
}

interface AudioInstance {
  audio: Howl | null
  loaded: boolean
  error: string | null
}

export default function SoundEffects({ className }: SoundEffectsProps): React.ReactElement {
  const [isMuted, setIsMuted] = useState(false)
  const [audioInstances, setAudioInstances] = useState<Record<string, AudioInstance>>({})
  const [userInteracted, setUserInteracted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const userInteractedRef = useRef(false) // Fix closure issue

  // Simplified audio configuration with fallback strategy
  const audioConfigs = {
    flintStrike: {
      name: "Flint Strike",
      files: ["/sounds/flint-strike.mp3"],
    },
    whisper: {
      name: "Whisper",
      files: ["/sounds/whisper.mp3"],
    },
    glitch: {
      name: "Glitch",
      files: ["/sounds/glitch.mp3"],
    },
  }

  useEffect(() => {
    // Wrap async calls in an inner function
    const init = async () => {
      await initializeAudio()
      setupEventListeners()
    }
    init()
    return () => cleanupEventListeners()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    for (const filename of files) {
      try {
        const audio = new Howl({
          src: [filename],
          volume: 0.5,
        })

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

          audio.on("load", onLoad)
          audio.on("loaderror", onError)

          setTimeout(() => {
            if (!resolved) {
              resolved = true
              resolve(false)
            }
          }, 2000)
        })

        if (canLoad) {
          return {
            audio,
            loaded: true,
            error: null,
          }
        }
      } catch (error) {
        continue
      }
    }

    return {
      audio: null,
      loaded: false,
      error: `Could not load ${name}`,
    }
  }

  // Store event handlers for cleanup
  const userInteractionEvents = useRef(["click", "touchstart", "keydown"])
  const handleUserInteraction = () => {
    if (!userInteractedRef.current) {
      userInteractedRef.current = true
      setUserInteracted(true)
    }
  }

  const setupEventListeners = () => {
    document.addEventListener("play-flint-strike", playFlintStrike)
    document.addEventListener("play-whisper", playWhisper)
    document.addEventListener("play-glitch", playGlitch)
    document.addEventListener("play-combination", playCombination)

    userInteractionEvents.current.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true })
    })
  }

  const cleanupEventListeners = () => {
    document.removeEventListener("play-flint-strike", playFlintStrike)
    document.removeEventListener("play-whisper", playWhisper)
    document.removeEventListener("play-glitch", playGlitch)
    document.removeEventListener("play-combination", playCombination)

    userInteractionEvents.current.forEach((event) => {
      document.removeEventListener(event, handleUserInteraction)
    })
  }

  const playAudio = async (key: string, volumeMultiplier = 1) => {
    if (isMuted || !userInteractedRef.current) return

    const instance = audioInstances[key]
    if (!instance?.loaded || !instance.audio) return

    try {
      instance.audio.volume(0.5 * volumeMultiplier)
      instance.audio.play()
    } catch (error) {
      // Silently fail
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
        {isMuted ? <VolumeX className="w-5 h-5 text-white/70" /> : <Volume2 className="w-5 h-5 text-white" />}
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
