import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import SoundEffects from "@/components/sound-effects"

export const metadata: Metadata = {
  title: "Starboard",
  description: "Astrological divination app",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
        <div className="fixed top-4 right-4 z-30">
          <SoundEffects />
        </div>
      </body>
    </html>
  )
}
