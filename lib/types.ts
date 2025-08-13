export interface Charm {
  id: string
  name: string
  description: string
  rarity: "common" | "rare"
}

export interface House {
  id: string
  name: string
  description: string
  keywords: string[]
}

export interface SavedReading {
  id: string
  date: string
  question: string
  charms: Charm[]
  houses: House[]
  name: string
}

export interface UserProfile {
  id: string
  name: string | null
  email: string | null
  image: string | null
  fortuneCount: number
  readingCount: number
  lastFortuneDate: string | null
  lastReadingDate: string | null
  createdAt: string
}
