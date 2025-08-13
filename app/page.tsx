"use client"

import { useState } from "react"
import { StarBackground } from "@/components/star-background"
import { CharmSelector } from "@/components/charm-selector"
import { UserInputForm } from "@/components/user-input-form"
import { ReadingSynopsis } from "@/components/reading-synopsis"
import { SavedReadings } from "@/components/saved-readings"
import { LuckySpinWheel } from "@/components/lucky-spin-wheel"
import { BottomNav } from "@/components/bottom-nav"
import { SignInButton } from "@/components/auth/sign-in-button"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const [selectedCharms, setSelectedCharms] = useState<string[]>([])
  const [userQuestion, setUserQuestion] = useState("")
  const [reading, setReading] = useState<string | null>(null)
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()

  const handleCharmsSelected = (charms: string[]) => {
    setSelectedCharms(charms)
  }

  const handleQuestionSubmitted = (question: string) => {
    setUserQuestion(question)
  }

  const handleReadingGenerated = (generatedReading: string) => {
    setReading(generatedReading)
  }

  const resetReading = () => {
    setSelectedCharms([])
    setUserQuestion("")
    setReading(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <StarBackground />
        <div className="text-white text-xl">Loading Starboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <StarBackground />

      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">✨ Starboard</h1>
        <SignInButton />
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {!isAuthenticated ? (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">Welcome to Starboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-purple-200">
                  Discover your cosmic destiny through mystical charm readings and celestial guidance.
                </p>
                <p className="text-purple-300 text-sm">Sign in to save your readings and track your cosmic journey.</p>
                <div className="pt-4">
                  <SignInButton />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {!reading ? (
              <>
                {selectedCharms.length === 0 ? (
                  <CharmSelector onCharmsSelected={handleCharmsSelected} />
                ) : !userQuestion ? (
                  <UserInputForm
                    selectedCharms={selectedCharms}
                    onQuestionSubmitted={handleQuestionSubmitted}
                    onBack={() => setSelectedCharms([])}
                  />
                ) : (
                  <ReadingSynopsis
                    selectedCharms={selectedCharms}
                    question={userQuestion}
                    onReadingGenerated={handleReadingGenerated}
                    onBack={() => setUserQuestion("")}
                  />
                )}
              </>
            ) : (
              <div className="space-y-6">
                <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Your Cosmic Reading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-purple-100 whitespace-pre-wrap leading-relaxed">{reading}</div>
                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={resetReading}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      >
                        New Reading
                      </button>
                      <button
                        onClick={() => setShowSpinWheel(true)}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        Lucky Spin
                      </button>
                    </div>
                  </CardContent>
                </Card>
                <SavedReadings />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Lucky Spin Wheel Modal */}
      {showSpinWheel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 max-w-md w-full">
            <LuckySpinWheel onClose={() => setShowSpinWheel(false)} />
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
