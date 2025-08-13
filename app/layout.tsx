import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import SoundEffects from "@/components/sound-effects"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Starboard - Cosmic Divination",
  description: "Discover your cosmic destiny through mystical charm readings and celestial guidance.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {children}
            <div className="fixed top-4 right-4 z-30">
              <SoundEffects />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
