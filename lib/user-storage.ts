export interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  createdAt: string
  lastLogin: string
  preferences: {
    soundEnabled: boolean
    theme: "light" | "dark" | "cosmic"
    notifications: boolean
  }
  stats: {
    totalReadings: number
    totalFortunes: number
    favoriteCharms: string[]
    streakDays: number
  }
}

export interface FortuneReading {
  id: string
  userId: string
  fortune: string
  timestamp: string
  type: "spin" | "shake" | "daily"
  mood?: string
}

export interface CharmReading {
  id: string
  userId: string
  question: string
  selectedCharms: string[]
  interpretation: string
  timestamp: string
  tags: string[]
  isPrivate: boolean
}

// User Profile Functions
export function getUserProfile(userId: string): UserProfile | null {
  if (typeof window === "undefined") return null

  try {
    const profile = localStorage.getItem(`starboard_profile_${userId}`)
    return profile ? JSON.parse(profile) : null
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(`starboard_profile_${profile.id}`, JSON.stringify(profile))
  } catch (error) {
    console.error("Error saving user profile:", error)
  }
}

export function createUserProfile(userData: {
  id: string
  name: string
  email: string
  image: string | null
}): UserProfile {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    image: userData.image,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: {
      soundEnabled: true,
      theme: "cosmic",
      notifications: true,
    },
    stats: {
      totalReadings: 0,
      totalFortunes: 0,
      favoriteCharms: [],
      streakDays: 0,
    },
  }
}

export function deleteReading(userId: string, id: string): void {
  if (typeof window === "undefined") return

  try {
    const readings = getUserReadings(userId)
    const updated = readings.filter(reading => reading.id !== id)
    localStorage.setItem(`starboard_readings_${userId}`, JSON.stringify(updated))
  } catch (error) {
    console.error("Error deleting reading:", error)
  }
}

// Fortune Functions
export function saveFortune(fortune: FortuneReading): void {
  if (typeof window === "undefined") return

  try {
    const fortunes = getUserFortunes(fortune.userId)
    fortunes.unshift(fortune)

    // Keep only last 50 fortunes
    const trimmedFortunes = fortunes.slice(0, 50)
    localStorage.setItem(`starboard_fortunes_${fortune.userId}`, JSON.stringify(trimmedFortunes))

    // Update user stats
    const profile = getUserProfile(fortune.userId)
    if (profile) {
      profile.stats.totalFortunes = trimmedFortunes.length
      profile.lastLogin = new Date().toISOString()
      saveUserProfile(profile)
    }
  } catch (error) {
    console.error("Error saving fortune:", error)
  }
}

export function getUserFortunes(userId: string): FortuneReading[] {
  if (typeof window === "undefined") return []

  try {
    const fortunes = localStorage.getItem(`starboard_fortunes_${userId}`)
    return fortunes ? JSON.parse(fortunes) : []
  } catch (error) {
    console.error("Error getting user fortunes:", error)
    return []
  }
}

export function getFortuneReadings(userId: string): FortuneReading[] {
  return getUserFortunes(userId)
}

export function saveFortuneReading(reading: FortuneReading): void {
  saveFortune(reading)
}

// Reading Functions
export function saveReading(reading: CharmReading): void {
  if (typeof window === "undefined") return

  try {
    const readings = getUserReadings(reading.userId)
    readings.unshift(reading)

    // Keep only last 100 readings
    const trimmedReadings = readings.slice(0, 100)
    localStorage.setItem(`starboard_readings_${reading.userId}`, JSON.stringify(trimmedReadings))

    // Update user stats
    const profile = getUserProfile(reading.userId)
    if (profile) {
      profile.stats.totalReadings = trimmedReadings.length
      profile.lastLogin = new Date().toISOString()

      // Update favorite charms
      reading.selectedCharms.forEach((charm) => {
        if (!profile.stats.favoriteCharms.includes(charm)) {
          profile.stats.favoriteCharms.push(charm)
        }
      })

      saveUserProfile(profile)
    }
  } catch (error) {
    console.error("Error saving reading:", error)
  }
}

export function getUserReadings(userId: string): CharmReading[] {
  if (typeof window === "undefined") return []

  try {
    const readings = localStorage.getItem(`starboard_readings_${userId}`)
    return readings ? JSON.parse(readings) : []
  } catch (error) {
    console.error("Error getting user readings:", error)
    return []
  }
}

// Utility Functions
export function clearUserData(userId: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(`starboard_profile_${userId}`)
    localStorage.removeItem(`starboard_fortunes_${userId}`)
    localStorage.removeItem(`starboard_readings_${userId}`)
  } catch (error) {
    console.error("Error clearing user data:", error)
  }
}

export function exportUserData(userId: string): string {
  if (typeof window === "undefined") return "{}"

  try {
    const profile = getUserProfile(userId)
    const fortunes = getUserFortunes(userId)
    const readings = getUserReadings(userId)

    return JSON.stringify(
      {
        profile,
        fortunes,
        readings,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    )
  } catch (error) {
    console.error("Error exporting user data:", error)
    return "{}"
  }
}
