'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditEpisodePage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [password] = useState(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem('lbt-admin-pw') || '' : ''
  )
  const [episode, setEpisode] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/episodes', { headers: { 'x-admin-password': password } })
      const data = await res.json()
      const ep = data.episodes?.find((e: any) => e.slug === slug)
      if (ep) {
        // Load full episode
        const { createClient } = await import('@supabase/supabase-js')
        const db = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: full } = await db.from('episodes').select('*').eq('slug', slug).single()
        setEpisode(full)
      }
      setLoading(false)
    }
    if (password) load()
  }, [slug, password])

  function updateField(key: string, value: any) {
    setEpisode(prev => prev ? { ...prev, [key]: value } : prev)
  }

  async function handleSave(status?: string) {
    setSaving(true)
    setError('')
    try {
      const payload = status ? { ...episode, status } : episode
      const res = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (status) setEpisode(prev => prev ? { ...prev, status } : prev)
    } catch (err: any) {
      setError(err.message)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-amber-lbt border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!episode) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center text-paper/40">
        Episode not found.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => router.push('/admin')} className="text-xs text-paper/40 hover:text-paper mb-2 block uppercase tracking-wider">
            ← Back
          </button>
          <h1 className="font-display text-2xl text-paper">{episode.guest_name}</h1>
          <p className="text-paper/40 text-xs mt-1">/shows/{episode.slug}</p>
        </div>
        <div className="flex gap-3 items-center">
          {saved && <span className="text-xs text-green-400 uppercase tracking-wider">Saved</span>}
          {episode.status === 'draft' ? (
            <button onClick={() => handleSave('published')} className="btn-primary bg-amber-lbt hover:bg-amber-dim text-sm">
              Publish
            </button>
          ) : (
            <button onClick={() => handleSave('draft')} className="btn-outline border-paper/20 text-paper/60 text-sm">
              Unpublish
            </button>
          )}
          <button onClick={() => handleSave()} disabled={saving} className="btn-primary text-sm">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-6">{error}</p>}

      <div className="space-y-6">
        {[
          { key: 'episode_title', label: 'Episode title', type: 'input' },
          { key: 'meta_description', label: 'Meta description', type: 'textarea', rows: 2 },
          { key: 'guest_name', label: 'Guest name', type: 'input' },
          { key: 'guest_title', label: 'Guest title', type: 'input' },
          { key: 'guest_bio', label: 'Guest bio', type: 'textarea', rows: 4 },
          { key: 'summary', label: 'Episode summary', type: 'textarea', rows: 4 },
          { key: 'pull_quote', label: 'Pull quote', type: 'textarea', rows: 3 },
          { key: 'career_path', label: 'Career path', type: 'textarea', rows: 5 },
          { key: 'what_makes_different', label: 'What makes this different', type: 'textarea', rows: 4 },
          { key: 'youtube_url', label: 'YouTube URL', type: 'input' },
          { key: 'spotify_url', label: 'Spotify URL', type: 'input' },
          { key: 'apple_url', label: 'Apple Podcasts URL', type: 'input' },
          { key: 'guest_image_url', label: 'Guest image URL', type: 'input' },
          { key: 'thumbnail_url', label: 'Thumbnail URL', type: 'input' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs uppercase tracking-wider text-paper/40 mb-2 block">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={episode[f.key] || ''}
                onChange={e => updateField(f.key, e.target.value)}
                rows={f.rows || 3}
                className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm resize-y"
              />
            ) : (
              <input
                value={episode[f.key] || ''}
                onChange={e => updateField(f.key, e.target.value)}
                className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm"
              />
            )}
          </div>
        ))}

        {/* View on site */}
        {episode.status === 'published' && (
          <a
            href={`/shows/${episode.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-lbt hover:text-amber-light uppercase tracking-wider"
          >
            View live page →
          </a>
        )}
      </div>
    </div>
  )
}
