import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import SoundEffects from "@/components/sound-effects"
import { AuthProvider } from "@/hooks/use-auth"

export const metadata: Metadata = {
  title: "Starboard",
  description: "Astrological divination app",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <div className="fixed top-4 right-4 z-30">
            <SoundEffects />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
