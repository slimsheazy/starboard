export interface House {
  number: number
  name: string
  keyword: string
  description: string
  contextKeyword?: string
}

export interface Charm {
  name: string
  description: string
  rarity: "common" | "uncommon" | "rare"
}

export interface ReadingContext {
  question: string
  lunarPhase: number
}

export interface SavedReading {
  id: string
  date: string
  question: string
  charms: Charm[]
  houses: House[]
  synopsis?: string
  name?: string
}
