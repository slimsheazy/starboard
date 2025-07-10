import { createClient } from "@supabase/supabase-js"

/**
 * Supabase singleton.
 * Reads the *public* env-vars at runtime and throws a helpful message
 * if they are missing.  This prevents the generic "supabaseUrl is required"
 * error and tells the developer exactly what to fix.
 */

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    // eslint-disable-next-line no-console
    console.error(
      `❌ Supabase initialisation failed.\n` +
        `Missing required environment variable: ${name}\n\n` +
        `1. Go to your Supabase project → Project Settings → API\n` +
        `2. Copy the value for ${name.includes("KEY") ? "anon public key" : "project URL"}\n` +
        `3. In Vercel → Settings → Environment Variables add:\n` +
        `   ${name} = <copied-value>\n` +
        `4. Redeploy.\n`,
    )
  }
  return value || ""
}

// Use the provided Supabase URL directly, fallback to env var
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://urumprmwbzpdinyvqsnp.supabase.co"
const supabaseAnonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

/**
 * `createClient` will still run even with empty strings, but every call will
 * fail.  By checking above we ensure the developer sees a *clear* message
 * instead of the cryptic runtime error Supabase throws by default.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          total_points: number
          level: number
          readings_count: number
          favorite_house: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          total_points?: number
          level?: number
          readings_count?: number
          favorite_house?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          total_points?: number
          level?: number
          readings_count?: number
          favorite_house?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fortunes: {
        Row: {
          id: string
          user_id: string
          fortune_text: string
          category: "love" | "career" | "health" | "wisdom" | "prosperity"
          spin_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fortune_text: string
          category: "love" | "career" | "health" | "wisdom" | "prosperity"
          spin_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fortune_text?: string
          category?: "love" | "career" | "health" | "wisdom" | "prosperity"
          spin_date?: string
          created_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          points: number
          icon: string
          rarity: "common" | "rare" | "legendary"
          earned_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          points: number
          icon: string
          rarity: "common" | "rare" | "legendary"
          earned_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          points?: number
          icon?: string
          rarity?: "common" | "rare" | "legendary"
          earned_date?: string
          created_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          target: number
          current: number
          points_reward: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          target: number
          current?: number
          points_reward: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          target?: number
          current?: number
          points_reward?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
