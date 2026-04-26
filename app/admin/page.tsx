'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface EpisodeSummary {
  id: string
  slug: string
  guest_name: string
  episode_title: string
  series: string
  episode_number: number
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
}

const seriesShort: Record<string, string> = {
  'life-between-titles': 'LBT',
  'work-unscripted': 'WU',
  'office-hours': 'OH',
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/episodes', {
      headers: { 'x-admin-password': password },
    })
    if (res.ok) {
      const data = await res.json()
      setEpisodes(data.episodes)
      setAuthed(true)
      // Store in session
      sessionStorage.setItem('lbt-admin-pw', password)
    } else {
      setError('Wrong password.')
    }
    setLoading(false)
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('lbt-admin-pw')
    if (saved) {
      setPassword(saved)
      fetch('/api/episodes', { headers: { 'x-admin-password': saved } })
        .then(r => r.json())
        .then(d => { if (d.episodes) { setEpisodes(d.episodes); setAuthed(true) } })
    }
  }, [])

  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <form onSubmit={login} className="w-full max-w-sm">
          <p className="font-display text-2xl mb-6 text-paper">Admin access</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="lbt-input bg-ink-soft border-paper/20 text-paper placeholder:text-paper/30 mb-3"
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    )
  }

  const published = episodes.filter(e => e.status === 'published')
  const drafts = episodes.filter(e => e.status === 'draft')

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total episodes', value: episodes.length },
          { label: 'Published', value: published.length },
          { label: 'Drafts', value: drafts.length },
        ].map(s => (
          <div key={s.label} className="bg-ink-soft border border-paper/10 p-6">
            <p className="text-3xl font-display font-bold text-paper mb-1">{s.value}</p>
            <p className="text-xs uppercase tracking-wider text-paper/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* New episode CTA */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-paper">Episodes</h2>
        <Link href="/admin/new-episode" className="btn-primary bg-amber-lbt hover:bg-amber-dim text-sm">
          + New episode
        </Link>
      </div>

      {/* Episode list */}
      <div className="space-y-2">
        {episodes.length === 0 && (
          <div className="text-center py-16 text-paper/30">
            <p className="font-display text-xl mb-2">No episodes yet</p>
            <p className="text-sm">Create your first one above.</p>
          </div>
        )}
        {episodes.map(ep => (
          <div key={ep.id} className="bg-ink-soft border border-paper/10 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <span className="label-tape text-xs flex-shrink-0">
                {seriesShort[ep.series]} {ep.episode_number}
              </span>
              <div className="min-w-0">
                <p className="text-paper text-sm font-medium truncate">{ep.episode_title}</p>
                <p className="text-paper/40 text-xs">{ep.guest_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-xs uppercase tracking-wider px-2 py-1 ${
                ep.status === 'published'
                  ? 'bg-green-900/40 text-green-400'
                  : 'bg-paper/10 text-paper/40'
              }`}>
                {ep.status}
              </span>
              <Link
                href={`/admin/episodes/${ep.slug}`}
                className="text-xs text-amber-lbt hover:text-amber-light transition-colors uppercase tracking-wider"
              >
                Edit →
              </Link>
              {ep.status === 'published' && (
                <a
                  href={`/shows/${ep.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-paper/30 hover:text-paper transition-colors uppercase tracking-wider"
                >
                  View →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
