import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client (uses service role key for admin operations)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  )
}

// Database types
export type Series = 'life-between-titles' | 'work-unscripted' | 'office-hours'
export type EpisodeStatus = 'draft' | 'published'

export interface Episode {
  id: string
  slug: string
  series: Series
  episode_number: number
  guest_name: string
  guest_title: string
  guest_bio: string
  guest_field_explainer: string
  episode_title: string
  meta_description: string
  summary: string
  key_topics: string[]
  pull_quote: string
  qa_excerpts: { question: string; answer: string }[]
  career_path: string
  what_makes_different: string
  story_bullets: string[]
  chapters: { time: string; title: string }[]
  youtube_url: string
  spotify_url: string
  apple_url: string
  guest_image_url: string
  thumbnail_url: string
  status: EpisodeStatus
  published_at: string | null
  created_at: string
  updated_at: string
}
