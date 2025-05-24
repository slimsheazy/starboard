"use client"

import { useState, useEffect } from "react"
import { SoundIcon, MuteIcon } from "./cosmic-icons"
import SoundDiagnostics from "./sound-diagnostics"

interface SoundEffectsProps {
  className?: string
}

interface AudioInstance {
  audio: HTMLAudioElement | null
  loaded: boolean
  error: string | null
  format: string | null
  path: string | null
}

export default function SoundEffects({ className }: SoundEffectsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [audioInstances, setAudioInstances] = useState<Record<string, AudioInstance>>({})
  const [userInteracted, setUserInteracted] = useState(false)
  const [initializationComplete, setInitializationComplete] = useState(false)

  // Updated audio file configurations to match your exact files
  const audioConfigs = {
    flintStrike: {
      name: "Flint Strike",
      // Try the exact files you have first, then fallbacks
      paths: [
        "/sounds/flint-strike.wav", // Your exact file
        "/sounds/flint-strike.mp3",
        "/sounds/flint-strike.ogg",
      ],
    },
    whisper: {
      name: "Whisper",
      paths: [
        "/sounds/whisper.wav", // Your exact file
        "/sounds/whisper.mp3",
        "/sounds/whisper.ogg",
      ],
    },
    glitch: {
      name: "Glitch",
      paths: [
        "/sounds/glitch.wav", // Your exact file
        "/sounds/glitch.mp3",
        "/sounds/glitch.ogg",
      ],
    },
  }

  useEffect(() => {
    // Log the current environment for debugging
    console.log("🔊 Sound Effects Initialization")
    console.log("Current URL:", window.location.href)
    console.log(
      "Expected files:",
      Object.values(audioConfigs).map((c) => c.paths[0]),
    )

    initializeAudio().catch((error) => {
      console.warn("Audio initialization failed:", error)
    })

    setupEventListeners()

    return () => {
      cleanupEventListeners()
    }
  }, [])

  const initializeAudio = async () => {
    console.log("🔊 Starting audio initialization...")
    const instances: Record<string, AudioInstance> = {}

    for (const [key, config] of Object.entries(audioConfigs)) {
      try {
        console.log(`\n🎵 Loading ${config.name}...`)
        instances[key] = await createAudioInstance(config.paths, config.name)
      } catch (error) {
        console.warn(`Failed to create audio instance for ${config.name}:`, error)
        instances[key] = {
          audio: null,
          loaded: false,
          error: `Failed to load: ${error}`,
          format: null,
          path: null,
        }
      }
    }

    setAudioInstances(instances)
    setInitializationComplete(true)

    const loadedCount = Object.values(instances).filter((i) => i.loaded).length
    const totalCount = Object.keys(instances).length

    console.log(`\n🔊 Audio initialization complete: ${loadedCount}/${totalCount} files loaded`)

    // Log detailed results
    Object.entries(instances).forEach(([key, instance]) => {
      if (instance.loaded) {
        console.log(`✅ ${key}: ${instance.path} (${instance.format})`)
      } else {
        console.log(`❌ ${key}: ${instance.error}`)
      }
    })

    if (loadedCount === 0) {
      console.warn("\n⚠️ No audio files could be loaded!")
      console.info("🔍 Troubleshooting steps:")
      console.info("1. Check if files exist at: /main/public/sounds/")
      console.info("2. Verify Next.js is serving static files correctly")
      console.info("3. Try accessing files directly: " + window.location.origin + "/sounds/flint-strike.wav")
      console.info("4. Check browser network tab for 404 errors")
      console.info("5. Ensure files are committed to your repository")
    }
  }

  const createAudioInstance = async (paths: string[], name: string): Promise<AudioInstance> => {
    console.log(`🔍 Attempting to load ${name}:`)

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i]
      console.log(`  ${i + 1}/${paths.length}: Testing ${path}`)

      try {
        // Enhanced file existence check with more detailed logging
        const fileCheck = await checkFileExistsDetailed(path)

        if (!fileCheck.exists) {
          console.log(`    ❌ File check failed: ${fileCheck.error}`)
          continue
        }

        console.log(`    ✅ File exists (${fileCheck.size} bytes, ${fileCheck.contentType})`)

        // Create and test audio element with better error handling
        const audioResult = await testAudioElement(path)

        if (audioResult.success) {
          console.log(`    🎵 Audio element created successfully`)
          return {
            audio: audioResult.audio!,
            loaded: true,
            error: null,
            format: path.split(".").pop()?.toUpperCase() || null,
            path,
          }
        } else {
          console.log(`    ❌ Audio element failed: ${audioResult.error}`)
        }
      } catch (error) {
        console.log(`    ❌ Exception: ${error}`)
      }
    }

    // If no path worked, return detailed failure info
    const errorMsg = `Could not load ${name}. Tried paths: ${paths.join(", ")}`
    console.warn(`❌ ${errorMsg}`)

    return {
      audio: null,
      loaded: false,
      error: errorMsg,
      format: null,
      path: null,
    }
  }

  // Enhanced file existence check with detailed response info
  const checkFileExistsDetailed = async (
    path: string,
  ): Promise<{
    exists: boolean
    error?: string
    size?: string
    contentType?: string
  }> => {
    try {
      console.log(`    🌐 Fetching: ${window.location.origin}${path}`)

      const response = await fetch(path, {
        method: "HEAD",
        cache: "no-cache",
      })

      if (!response.ok) {
        return {
          exists: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const size = response.headers.get("content-length") || "unknown"
      const contentType = response.headers.get("content-type") || "unknown"

      return {
        exists: true,
        size: size === "unknown" ? size : `${size} bytes`,
        contentType,
      }
    } catch (error) {
      return {
        exists: false,
        error: `Network error: ${error}`,
      }
    }
  }

  // Enhanced audio element testing
  const testAudioElement = async (
    path: string,
  ): Promise<{
    success: boolean
    audio?: HTMLAudioElement
    error?: string
  }> => {
    return new Promise((resolve) => {
      const audio = new Audio()
      let resolved = false

      const cleanup = () => {
        audio.removeEventListener("canplaythrough", onCanPlay)
        audio.removeEventListener("error", onError)
        audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      }

      const onCanPlay = () => {
        if (!resolved) {
          resolved = true
          cleanup()
          resolve({ success: true, audio })
        }
      }

      const onLoadedMetadata = () => {
        if (!resolved) {
          resolved = true
          cleanup()
          resolve({ success: true, audio })
        }
      }

      const onError = (e: any) => {
        if (!resolved) {
          resolved = true
          cleanup()
          resolve({
            success: false,
            error: `Audio error: ${e.type} - ${audio.error?.message || "Unknown error"}`,
          })
        }
      }

      // Set up event listeners
      audio.addEventListener("canplaythrough", onCanPlay)
      audio.addEventListener("loadedmetadata", onLoadedMetadata)
      audio.addEventListener("error", onError)

      // Configure audio
      audio.preload = "metadata"
      audio.volume = 0.7

      // Timeout after 5 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true
          cleanup()
          resolve({
            success: false,
            error: "Timeout - file took too long to load",
          })
        }
      }, 5000)

      // Start loading
      audio.src = path
      audio.load()
    })
  }

  const setupEventListeners = () => {
    document.addEventListener("play-flint-strike", playFlintStrike)
    document.addEventListener("play-whisper", playWhisper)
    document.addEventListener("play-glitch", playGlitch)
    document.addEventListener("play-combination", playCombination)

    // Detect user interaction
    const handleUserInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true)
        console.log("🎵 User interaction detected - audio enabled")
      }
    }

    const events = ["click", "touchstart", "keydown", "mousedown"]
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
    if (isMuted) {
      console.log(`🔇 Audio muted, skipping ${key}`)
      return
    }

    const instance = audioInstances[key]
    if (!instance) {
      console.warn(`❌ Audio instance not found: ${key}`)
      return
    }

    if (!instance.loaded || !instance.audio) {
      console.warn(`❌ Audio not loaded for ${key}:`, instance.error || "Unknown error")
      return
    }

    if (!userInteracted) {
      console.info(`🔇 User interaction required for ${key} - audio blocked by browser`)
      return
    }

    try {
      // Clone the audio to allow overlapping sounds
      const audioClone = instance.audio.cloneNode() as HTMLAudioElement
      audioClone.currentTime = 0
      audioClone.volume = Math.min(1, 0.7 * volumeMultiplier)

      await audioClone.play()
      console.log(`🔊 Successfully played: ${key}`)
    } catch (error) {
      console.error(`❌ Failed to play ${key}:`, error)

      if (error instanceof Error && error.name === "NotAllowedError") {
        console.info("💡 Audio autoplay blocked - user interaction required")
      }
    }
  }

  const playFlintStrike = () => playAudio("flintStrike")
  const playWhisper = () => playAudio("whisper")
  const playGlitch = () => playAudio("glitch")
  const playCombination = () => playAudio("glitch", 1.2)

  const toggleMute = () => {
    setIsMuted(!isMuted)
    console.log(`🔊 Audio ${!isMuted ? "muted" : "unmuted"}`)
  }

  const getLoadedCount = () => {
    return Object.values(audioInstances).filter((instance) => instance.loaded).length
  }

  const getTotalCount = () => {
    return Object.keys(audioConfigs).length
  }

  const hasErrors = () => {
    return Object.values(audioInstances).some((instance) => instance.error)
  }

  const getStatusColor = () => {
    if (!initializationComplete) return "text-yellow-400"
    const loadedCount = getLoadedCount()
    if (loadedCount === 0) return "text-red-400"
    if (loadedCount < getTotalCount()) return "text-yellow-400"
    return "text-green-400"
  }

  const getStatusText = () => {
    if (!initializationComplete) return "Loading..."
    const loadedCount = getLoadedCount()
    const totalCount = getTotalCount()

    if (loadedCount === 0) return "No audio files"
    if (loadedCount < totalCount) return `${loadedCount}/${totalCount} loaded`
    return "All files loaded"
  }

  return (
    <div className={`${className || ""} relative`}>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className={`p-2 rounded-full ${isMuted ? "bg-black/30 border-2 border-white/20" : "bg-neon-pink/30 border-2 border-neon-pink"} hover:border-white/40 transition-colors`}
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          title={`${isMuted ? "Unmute" : "Mute"} sounds - ${getStatusText()}${!userInteracted ? " (click to enable)" : ""}`}
        >
          {isMuted ? <MuteIcon className="w-5 h-5 text-white/70" /> : <SoundIcon className="w-5 h-5 text-white" />}
        </button>

        <button
          onClick={() => setShowDiagnostics(true)}
          className="p-1 rounded text-xs bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
          title="Open sound diagnostics"
        >
          🔧
        </button>
      </div>

      {/* Status indicator */}
      <div className={`absolute top-full left-0 mt-1 text-xs ${getStatusColor()} whitespace-nowrap`}>
        {getStatusText()}
      </div>

      {/* Diagnostics modal */}
      {showDiagnostics && <SoundDiagnostics onClose={() => setShowDiagnostics(false)} />}
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
