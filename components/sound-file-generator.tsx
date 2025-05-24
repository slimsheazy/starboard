"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CloseIcon, DownloadIcon } from "./cosmic-icons"

interface SoundFileGeneratorProps {
  onClose: () => void
}

export default function SoundFileGenerator({ onClose }: SoundFileGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate simple audio files using Web Audio API
  const generateAudioFile = (type: "flint" | "whisper" | "glitch", duration = 1) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const sampleRate = audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    // Generate different sounds based on type
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate

      switch (type) {
        case "flint":
          // Sharp crackling sound
          data[i] = (Math.random() - 0.5) * Math.exp(-t * 5) * Math.sin(t * 1000 + Math.random() * 10)
          break
        case "whisper":
          // Soft whoosh sound
          data[i] = (Math.random() - 0.5) * 0.3 * Math.exp(-t * 2) * Math.sin(t * 200)
          break
        case "glitch":
          // Digital glitch sound
          data[i] = (Math.random() - 0.5) * Math.exp(-t * 3) * Math.sin(t * 800 + Math.sin(t * 50) * 100)
          break
      }
    }

    return buffer
  }

  const downloadAudioBuffer = (buffer: AudioBuffer, filename: string) => {
    // Convert AudioBuffer to WAV
    const length = buffer.length
    const arrayBuffer = new ArrayBuffer(44 + length * 2)
    const view = new DataView(arrayBuffer)

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, "RIFF")
    view.setUint32(4, 36 + length * 2, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, buffer.sampleRate, true)
    view.setUint32(28, buffer.sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, length * 2, true)

    // Convert float samples to 16-bit PCM
    const data = buffer.getChannelData(0)
    let offset = 44
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]))
      view.setInt16(offset, sample * 0x7fff, true)
      offset += 2
    }

    // Download
    const blob = new Blob([arrayBuffer], { type: "audio/wav" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateAllSounds = async () => {
    setIsGenerating(true)

    try {
      const sounds = [
        { type: "flint" as const, filename: "flint-strike.wav", duration: 0.5 },
        { type: "whisper" as const, filename: "whisper.wav", duration: 1.5 },
        { type: "glitch" as const, filename: "glitch.wav", duration: 0.8 },
      ]

      for (const sound of sounds) {
        const buffer = generateAudioFile(sound.type, sound.duration)
        downloadAudioBuffer(buffer, sound.filename)
        await new Promise((resolve) => setTimeout(resolve, 500)) // Small delay between downloads
      }
    } catch (error) {
      console.error("Error generating sounds:", error)
      alert("Error generating sounds. Your browser may not support the Web Audio API.")
    }

    setIsGenerating(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
    >
      <div className="w-full max-w-md bg-black/90 border-2 border-white/20 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">🎵 Generate Sound Files</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-600/20 border border-blue-400/40 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-300 mb-2">Missing Sound Files?</h3>
            <p className="text-xs text-blue-200 mb-3">
              If your sound files are missing or not working, you can generate basic placeholder sounds using your
              browser's Web Audio API.
            </p>
            <p className="text-xs text-blue-200">
              These generated files should be placed in your{" "}
              <code className="bg-black/30 px-1 rounded">public/sounds/</code> directory.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/90">Generated Files:</h4>
            <ul className="text-xs text-white/70 space-y-1">
              <li>• flint-strike.wav - Sharp crackling sound</li>
              <li>• whisper.wav - Soft whoosh sound</li>
              <li>• glitch.wav - Digital glitch sound</li>
            </ul>
          </div>

          <button
            onClick={generateAllSounds}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-neon-pink/30 border border-neon-pink rounded-lg text-sm text-white hover:bg-neon-pink/40 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <DownloadIcon className="w-4 h-4" />
                Generate & Download Sounds
              </>
            )}
          </button>

          <div className="bg-yellow-600/20 border border-yellow-600/40 rounded-lg p-3">
            <p className="text-xs text-yellow-300">
              <strong>Note:</strong> After downloading, upload these files to your repository's{" "}
              <code className="bg-black/30 px-1 rounded">public/sounds/</code> directory and redeploy your app.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
