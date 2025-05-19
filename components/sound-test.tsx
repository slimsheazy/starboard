"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"

export default function SoundTest() {
  const [soundStatus, setSoundStatus] = useState<{
    glitch: boolean
    flintStrike: boolean
    whisper: boolean
  } | null>(null)

  useEffect(() => {
    // Check if sound files exist
    const checkSoundFiles = async () => {
      try {
        const soundFiles = ["/sounds/glitch.mp3", "/sounds/flint-strike.mp3", "/sounds/whisper.mp3"]

        const results = await Promise.all(
          soundFiles.map(async (url) => {
            try {
              const response = await fetch(url, { method: "HEAD" })
              return response.ok
            } catch (e) {
              return false
            }
          }),
        )

        setSoundStatus({
          glitch: results[0],
          flintStrike: results[1],
          whisper: results[2],
        })
      } catch (error) {
        console.error("Error checking sound files:", error)
      }
    }

    checkSoundFiles()
  }, [])

  if (!soundStatus) return null

  // If all sound files exist, don't show anything
  if (soundStatus.glitch && soundStatus.flintStrike && soundStatus.whisper) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-900/80 text-white p-3 text-sm flex items-start gap-2">
      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-semibold">Sound files missing</p>
        <p className="text-xs mt-1">Some sound files are missing from the public directory:</p>
        <ul className="text-xs mt-1 list-disc pl-4">
          {!soundStatus.glitch && <li>Missing: /public/sounds/glitch.mp3</li>}
          {!soundStatus.flintStrike && <li>Missing: /public/sounds/flint-strike.mp3</li>}
          {!soundStatus.whisper && <li>Missing: /public/sounds/whisper.mp3</li>}
        </ul>
        <p className="text-xs mt-2">
          Please add these files to enable sound effects. The app will still work without sounds.
        </p>
      </div>
    </div>
  )
}
