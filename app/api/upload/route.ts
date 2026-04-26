import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-password')
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'guest' or 'thumbnail'
    const slug = formData.get('slug') as string

    if (!file || !slug) {
      return NextResponse.json({ error: 'File and slug required' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const path = `${slug}/${type}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const db = createServerClient()
    const { error } = await db.storage
      .from('episode-images')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: urlData } = db.storage.from('episode-images').getPublicUrl(path)

    return NextResponse.json({ success: true, url: urlData.publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
