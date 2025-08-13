"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { XIcon, BookOpen, Trash2, Eye, CalendarDays } from "lucide-react"
import type { FortuneReading, CharmReading } from "@/lib/user-storage"
// Define the Fortune type locally if not exported from user-storage
type Fortune = {
  id: string
  createdAt: string | number | Date
  result: string
}

import { deleteReading, getUserReadings } from "@/lib/user-storage"
import { useAuth } from "@/lib/auth-context"
import { charms } from "@/lib/charms"

interface SavedReadingsProps {
  readings: CharmReading[]
  fortunes: FortuneReading[]
  onClose: () => void
  onSelectReading: (reading: CharmReading) => void
}

export function SavedReadings({ readings, fortunes, onClose, onSelectReading }: SavedReadingsProps) {
  const [activeTab, setActiveTab] = useState("readings")
  const { user } = useAuth()

  const handleDeleteReading = (id: string) => {
    if (user?.id) {
      deleteReading(user.id, id)
      // Re-fetch readings after deletion
      // This would ideally be handled by a state update or a re-fetch in the parent component
      // For now, we'll just filter locally for immediate UI update
      const updatedReadings = getUserReadings(user.id)
      // You might need to pass a setter from parent or use a global state management
      // For this example, we'll assume the parent re-renders or state is managed there.
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <Card className="w-full max-w-2xl h-[90vh] bg-white/10 backdrop-blur-md border-white/20 text-white flex flex-col">
        <CardHeader className="relative pb-4">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-400" />
            My Cosmic History
          </CardTitle>
          <CardDescription className="text-white/80 text-center">Your past readings and fortunes.</CardDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md rounded-none border-b border-white/20">
              <TabsTrigger value="readings" className="data-[state=active]:bg-white/20 rounded-none">
                Readings ({readings.length})
              </TabsTrigger>
              <TabsTrigger value="fortunes" className="data-[state=active]:bg-white/20 rounded-none">
                Fortunes ({fortunes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="readings" className="flex-1 p-6 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                {readings.length === 0 ? (
                  <p className="text-center text-white/70 mt-8">No saved readings yet. Start a new one!</p>
                ) : (
                  <div className="space-y-4">
                    {readings.map((reading) => (
                      <div key={reading.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-white">
                              {reading.question || "Untitled Reading"}
                            </h3>
                            <p className="text-sm text-white/70 flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(reading.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onSelectReading(reading)}
                              className="text-blue-400 hover:bg-white/10"
                            >
                              <Eye className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteReading(reading.id)}
                              className="text-red-400 hover:bg-white/10"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {reading.selectedCharms.map((charmId) => {
                            const charm = charms.find((c) => c.id === charmId)
                            return charm ? (
                              <span
                                key={charm.id}
                                className="bg-purple-600/20 text-purple-200 text-xs px-2 py-1 rounded-full"
                              >
                                {charm.name}
                              </span>
                            ) : null
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="fortunes" className="flex-1 p-6 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                {fortunes.length === 0 ? (
                  <p className="text-center text-white/70 mt-8">No saved fortunes yet. Try the Lucky Spin!</p>
                ) : (
                  <div className="space-y-4">
                    {fortunes.map((fortune) => (
                      <div key={fortune.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-white">Lucky Spin Fortune</h3>
                            <p className="text-sm text-white/70 flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(fortune.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:bg-white/10">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                        <p className="text-white/90 leading-relaxed mt-2">"{fortune.fortune}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
