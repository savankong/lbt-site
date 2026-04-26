import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-password')
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const db = createServerClient()

    // Upsert episode (insert or update by slug)
    const { data, error } = await db
      .from('episodes')
      .upsert(
        {
          ...body,
          updated_at: new Date().toISOString(),
          published_at: body.status === 'published' ? new Date().toISOString() : null,
        },
        { onConflict: 'slug' }
      )
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, episode: data })
  } catch (err) {
    console.error('Save episode error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-password')
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServerClient()
  const { data, error } = await db
    .from('episodes')
    .select('id, slug, guest_name, episode_title, series, episode_number, status, published_at, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ episodes: data })
}
