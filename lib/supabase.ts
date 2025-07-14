import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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
