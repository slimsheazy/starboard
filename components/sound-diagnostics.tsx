"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CloseIcon, SoundIcon, DownloadIcon } from "./cosmic-icons"
import SoundFileGenerator from "./sound-file-generator"

interface SoundDiagnosticsProps {
  onClose: () => void
}

interface AudioFileStatus {
  path: string
  name: string
  exists: boolean
  canPlay: boolean
  error?: string
  duration?: number
  format?: string
  size?: number
  httpStatus?: number
  contentType?: string
}

export default function SoundDiagnostics({ onClose }: SoundDiagnosticsProps) {
  const [audioFiles, setAudioFiles] = useState<AudioFileStatus[]>([])
  const [isChecking, setIsChecking] = useState(true)
  const [userInteracted, setUserInteracted] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [networkInfo, setNetworkInfo] = useState<{
    baseUrl: string
    isLocalhost: boolean
    protocol: string
  }>()

  // Your exact files based on the repository structure
  const expectedFiles = [
    {
      name: "Flint Strike",
      paths: ["/sounds/flint-strike.wav", "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flint-strike-bphk60QXtcP3Yek3qdjwubQEqnzGbu.mp3", "/sounds/flint-strike.ogg"],
    },
    {
      name: "Whisper",
      paths: ["/sounds/whisper.wav", "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/whisper-mrOgzMewQZXvuVVQz9x4A4HWvDxaSO.mp3", "/sounds/whisper.ogg"],
    },
    {
      name: "Glitch",
      paths: ["/sounds/glitch.wav", "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/glitch-UJGqjZQ7KU5kZCLvKqo7rngcfsCCPK.mp3", "/sounds/glitch.ogg"],
    },
  ]

  useEffect(() => {
    // Gather network information
    setNetworkInfo({
      baseUrl: window.location.origin,
      isLocalhost: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1",
      protocol: window.location.protocol,
    })

    checkAudioFiles()
  }, [])

  const checkAudioFiles = async () => {
    setIsChecking(true)
    const results: AudioFileStatus[] = []

    console.log("🔍 Starting comprehensive audio file check...")
    console.log("Base URL:", window.location.origin)

    for (const file of expectedFiles) {
      let bestResult: AudioFileStatus | null = null

      // Try each format for this sound
      for (const path of file.paths) {
        console.log(`\n🎵 Testing: ${file.name} at ${path}`)

        try {
          // Detailed HTTP check
          const fullUrl = `${window.location.origin}${path}`
          console.log(`  Full URL: ${fullUrl}`)

          const response = await fetch(path, {
            method: "HEAD",
            cache: "no-cache",
          })

          console.log(`  HTTP Status: ${response.status} ${response.statusText}`)

          const exists = response.ok
          let size: number | undefined
          let contentType: string | undefined

          if (exists) {
            const contentLength = response.headers.get("content-length")
            contentType = response.headers.get("content-type") || undefined

            if (contentLength) {
              size = Number.parseInt(contentLength, 10)
            }

            console.log(`  Content-Type: ${contentType}`)
            console.log(`  Content-Length: ${contentLength || "unknown"}`)

            // Test audio playability
            const audio = new Audio()
            const canPlay = await new Promise<boolean>((resolve) => {
              let resolved = false

              const onCanPlay = () => {
                if (!resolved) {
                  resolved = true
                  audio.removeEventListener("canplaythrough", onCanPlay)
                  audio.removeEventListener("error", onError)
                  console.log(`  ✅ Audio can play`)
                  resolve(true)
                }
              }

              const onError = (e: any) => {
                if (!resolved) {
                  resolved = true
                  audio.removeEventListener("canplaythrough", onCanPlay)
                  audio.removeEventListener("error", onError)
                  console.log(`  ❌ Audio error:`, e)
                  resolve(false)
                }
              }

              audio.addEventListener("canplaythrough", onCanPlay)
              audio.addEventListener("error", onError)

              setTimeout(() => {
                if (!resolved) {
                  resolved = true
                  console.log(`  ⏱️ Audio test timeout`)
                  resolve(false)
                }
              }, 3000)

              audio.src = path
              audio.load()
            })

            bestResult = {
              path,
              name: file.name,
              exists: true,
              canPlay,
              duration: audio.duration || undefined,
              format: path.split(".").pop()?.toUpperCase(),
              size,
              httpStatus: response.status,
              contentType,
            }

            // If we found a working file, use it and stop checking other formats
            if (canPlay) {
              console.log(`  🎉 Found working audio file!`)
              break
            }
          } else {
            console.log(`  ❌ File not found (HTTP ${response.status})`)
          }
        } catch (error) {
          console.log(`  ❌ Network error:`, error)
        }
      }

      // If no working file found, add a failed result
      if (!bestResult) {
        results.push({
          path: file.paths[0], // Show the primary path
          name: file.name,
          exists: false,
          canPlay: false,
          error: "File not found at any expected path",
        })
      } else {
        results.push(bestResult)
      }
    }

    setAudioFiles(results)
    setIsChecking(false)

    // Summary logging
    const workingFiles = results.filter((f) => f.canPlay).length
    console.log(`\n📊 Audio Check Summary: ${workingFiles}/${results.length} files working`)
  }

  const testPlayAudio = async (audioFile: AudioFileStatus) => {
    if (!audioFile.canPlay) return

    try {
      const audio = new Audio(audioFile.path)
      audio.volume = 0.5

      if (!userInteracted) {
        setUserInteracted(true)
      }

      await audio.play()
      console.log(`✓ Successfully played: ${audioFile.name}`)
    } catch (error) {
      console.error(`✗ Failed to play ${audioFile.name}:`, error)
      alert(`Failed to play ${audioFile.name}: ${error}`)
    }
  }

  const testDirectAccess = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`
    window.open(fullUrl, "_blank")
  }

  const downloadDiagnosticReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      networkInfo,
      audioSupport: {
        mp3: document.createElement("audio").canPlayType("audio/mpeg"),
        wav: document.createElement("audio").canPlayType("audio/wav"),
        ogg: document.createElement("audio").canPlayType("audio/ogg"),
      },
      expectedFiles: expectedFiles,
      actualFiles: audioFiles,
      troubleshooting: generateTroubleshootingSteps(),
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "starboard-audio-diagnostics.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateTroubleshootingSteps = () => {
    const steps: string[] = []
    const workingFiles = audioFiles.filter((f) => f.canPlay).length

    if (workingFiles === 0) {
      steps.push("No audio files are loading. Check these items:")
      steps.push("1. Verify files exist in your repository at /main/public/sounds/")
      steps.push("2. Ensure files are named: flint-strike.wav, whisper.wav, glitch.wav")
      steps.push("3. Check that files are committed and pushed to your repository")
      steps.push("4. Verify your deployment includes the public/sounds directory")
      steps.push("5. Try accessing files directly in browser")
    } else if (workingFiles < audioFiles.length) {
      steps.push(`${workingFiles}/${audioFiles.length} files working. Check missing files.`)
    } else {
      steps.push("All files are loading correctly!")
    }

    return steps
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
    >
      <div className="w-full max-w-lg bg-black/90 border-2 border-white/20 rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">🔊 Sound Diagnostics</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {isChecking ? (
          <div className="text-center py-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <p className="text-white/70">Checking audio files...</p>
            <p className="text-white/50 text-xs mt-2">Check browser console for detailed logs</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Network Information */}
            {networkInfo && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-sm font-medium text-white/90 mb-2">Network Information:</h3>
                <div className="text-xs text-white/70 space-y-1">
                  <div>
                    Base URL: <span className="font-mono">{networkInfo.baseUrl}</span>
                  </div>
                  <div>
                    Protocol: <span className="font-mono">{networkInfo.protocol}</span>
                  </div>
                  <div>
                    Environment:{" "}
                    <span className="font-mono">{networkInfo.isLocalhost ? "Local Development" : "Production"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Browser Support */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-medium text-white/90 mb-2">Browser Audio Support:</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-white/60">MP3</div>
                  <div
                    className={
                      document.createElement("audio").canPlayType("audio/mpeg") ? "text-green-400" : "text-red-400"
                    }
                  >
                    {document.createElement("audio").canPlayType("audio/mpeg") || "No"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white/60">WAV</div>
                  <div
                    className={
                      document.createElement("audio").canPlayType("audio/wav") ? "text-green-400" : "text-red-400"
                    }
                  >
                    {document.createElement("audio").canPlayType("audio/wav") || "No"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white/60">OGG</div>
                  <div
                    className={
                      document.createElement("audio").canPlayType("audio/ogg") ? "text-green-400" : "text-red-400"
                    }
                  >
                    {document.createElement("audio").canPlayType("audio/ogg") || "No"}
                  </div>
                </div>
              </div>
            </div>

            {/* File Status */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/90">Audio Files Status:</h3>
              {audioFiles.map((file, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-white text-sm">{file.name}</div>
                      <div className="text-xs text-white/60 font-mono">{file.path}</div>
                      <div className="flex gap-4 text-xs text-white/50 mt-1">
                        {file.format && <span>Format: {file.format}</span>}
                        {file.size && <span>Size: {formatFileSize(file.size)}</span>}
                        {file.httpStatus && <span>HTTP: {file.httpStatus}</span>}
                        {file.contentType && <span>Type: {file.contentType}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${file.exists ? "bg-green-400" : "bg-red-400"}`}></div>
                      <div className={`w-2 h-2 rounded-full ${file.canPlay ? "bg-green-400" : "bg-red-400"}`}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      <span className={file.exists ? "text-green-400" : "text-red-400"}>
                        {file.exists ? "✓ Found" : "✗ Missing"}
                      </span>
                      {" • "}
                      <span className={file.canPlay ? "text-green-400" : "text-red-400"}>
                        {file.canPlay ? "✓ Playable" : "✗ Cannot Play"}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {file.canPlay && (
                        <button
                          onClick={() => testPlayAudio(file)}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white flex items-center gap-1"
                        >
                          <SoundIcon className="w-3 h-3" />
                          Test
                        </button>
                      )}
                      <button
                        onClick={() => testDirectAccess(file.path)}
                        className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 rounded text-xs text-blue-300"
                      >
                        Open
                      </button>
                    </div>
                  </div>

                  {file.error && <div className="text-xs text-red-400 mt-1">{file.error}</div>}
                </div>
              ))}
            </div>

            {/* Troubleshooting */}
            <div className="bg-yellow-600/20 border border-yellow-600/40 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-300 mb-2">Troubleshooting:</h3>
              <div className="text-xs text-yellow-200 space-y-1">
                {generateTroubleshootingSteps().map((step, index) => (
                  <div key={index}>{step}</div>
                ))}
              </div>
            </div>

            {/* Repository Info */}
            <div className="bg-blue-600/20 border border-blue-400/40 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-300 mb-2">Expected Repository Structure:</h3>
              <div className="text-xs text-blue-200 font-mono space-y-1">
                <div>/main/public/sounds/</div>
                <div>├── flint-strike.wav</div>
                <div>├── whisper.wav</div>
                <div>└── glitch.wav</div>
              </div>
              <div className="text-xs text-blue-200 mt-2">
                These files should be accessible at: /sounds/filename.wav
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={checkAudioFiles}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white"
              >
                Recheck Files
              </button>
              <button
                onClick={() => setShowGenerator(true)}
                className="flex-1 px-4 py-2 bg-green-600/30 border border-green-400 rounded-lg text-sm text-white hover:bg-green-600/40"
              >
                Generate Sounds
              </button>
              <button
                onClick={downloadDiagnosticReport}
                className="px-4 py-2 bg-neon-pink/30 border border-neon-pink rounded-lg text-sm text-white hover:bg-neon-pink/40"
              >
                <DownloadIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Sound Generator Modal */}
        {showGenerator && <SoundFileGenerator onClose={() => setShowGenerator(false)} />}
      </div>
    </motion.div>
  )
}
