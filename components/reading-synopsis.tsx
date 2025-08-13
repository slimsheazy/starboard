"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, RefreshCw, Download } from "lucide-react"
import type { Reading } from "@/lib/user-storage"
import { charms } from "@/lib/charms"
import { Badge } from "@/components/ui/badge"

interface ReadingSynopsisProps {
  reading: Reading
  onNewReading: () => void
}

export function ReadingSynopsis({ reading, onNewReading }: ReadingSynopsisProps) {
  const selectedCharmNames = reading.charms.map((id) => charms.find((c) => c.id === id)?.name || "Unknown Charm")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader className="text-center">
          <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">Your Cosmic Reading</CardTitle>
          <CardDescription className="text-white/80">Insights from the stars and your chosen charms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {reading.question && (
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Your Question:</h3>
              <p className="italic text-white/90">"{reading.question}"</p>
            </div>
          )}

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Selected Charms:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCharmNames.map((name, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-600/20 text-purple-200">
                  {name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Interpretation:</h3>
            <p className="text-white/90 leading-relaxed">{reading.interpretation}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              onClick={onNewReading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              New Reading
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 flex items-center gap-2 bg-transparent"
              // onClick={() => generatePDF(reading)} // Implement PDF generation
            >
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
