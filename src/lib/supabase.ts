import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
  console.log('Required variables:')
  console.log('- VITE_SUPABASE_URL')
  console.log('- VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseKey || 'dummy-key-for-development'
)

// Types for database tables
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          created_by: string
          created_at: string
          updated_at: string
          status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
          tags: string[]
          team_members: string[]
          likes_count: number
          comments_count: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          status?: 'planning' | 'in_progress' | 'completed' | 'on_hold'
          tags?: string[]
          team_members?: string[]
          likes_count?: number
          comments_count?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          status?: 'planning' | 'in_progress' | 'completed' | 'on_hold'
          tags?: string[]
          team_members?: string[]
          likes_count?: number
          comments_count?: number
        }
      }
    }
  }
}
