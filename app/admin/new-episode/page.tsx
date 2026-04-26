'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'upload' | 'generating' | 'review' | 'saving' | 'done'

const seriesOptions = [
  { value: 'life-between-titles', label: 'Life Between Titles' },
  { value: 'work-unscripted', label: 'Work, Unscripted' },
  { value: 'office-hours', label: 'Office Hours' },
]

export default function NewEpisodePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [password] = useState(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem('lbt-admin-pw') || '' : ''
  )

  // Upload form state
  const [transcript, setTranscript] = useState('')
  const [series, setSeries] = useState('life-between-titles')
  const [episodeNumber, setEpisodeNumber] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [appleUrl, setAppleUrl] = useState('')

  // Image uploads
  const [guestImageFile, setGuestImageFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [guestImagePreview, setGuestImagePreview] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  // Generated data
  const [generated, setGenerated] = useState<Record<string, any> | null>(null)
  const [error, setError] = useState('')

  // Editable fields in review
  const [editData, setEditData] = useState<Record<string, any>>({})

  function handleTranscriptFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => setTranscript(e.target?.result as string)
    reader.readAsText(file)
  }

  function handleImageFile(file: File, type: 'guest' | 'thumbnail') {
    const preview = URL.createObjectURL(file)
    if (type === 'guest') { setGuestImageFile(file); setGuestImagePreview(preview) }
    else { setThumbnailFile(file); setThumbnailPreview(preview) }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!transcript.trim()) { setError('Paste or upload a transcript first.'); return }
    setError('')
    setStep('generating')

    try {
      const res = await fetch('/api/process-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ transcript, series, episodeNumber: parseInt(episodeNumber) || 1 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      setGenerated(data.data)
      setEditData({
        ...data.data,
        series,
        episode_number: parseInt(episodeNumber) || 1,
        youtube_url: youtubeUrl,
        spotify_url: spotifyUrl,
        apple_url: appleUrl,
        status: 'draft',
      })
      setStep('review')
    } catch (err: any) {
      setError(err.message)
      setStep('upload')
    }
  }

  async function uploadImages(slug: string) {
    const urls: { guest_image_url?: string; thumbnail_url?: string } = {}

    for (const [type, file] of [['guest', guestImageFile], ['thumbnail', thumbnailFile]] as const) {
      if (!file) continue
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', type)
      fd.append('slug', slug)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: fd,
      })
      const data = await res.json()
      if (data.url) {
        if (type === 'guest') urls.guest_image_url = data.url
        else urls.thumbnail_url = data.url
      }
    }
    return urls
  }

  async function handleSave(status: 'draft' | 'published') {
    setStep('saving')
    try {
      const imageUrls = await uploadImages(editData.slug)
      const payload = { ...editData, ...imageUrls, status }

      const res = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setStep('done')
      setTimeout(() => router.push('/admin'), 1500)
    } catch (err: any) {
      setError(err.message)
      setStep('review')
    }
  }

  function updateField(key: string, value: any) {
    setEditData(prev => ({ ...prev, [key]: value }))
  }

  // ── STEP: UPLOAD ──
  if (step === 'upload') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <button onClick={() => router.push('/admin')} className="text-xs text-paper/40 hover:text-paper mb-4 block uppercase tracking-wider">
            ← Back to dashboard
          </button>
          <h1 className="font-display text-3xl text-paper">New episode</h1>
          <p className="text-paper/50 text-sm mt-1">Upload a transcript and Claude will generate the full episode page.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Series + Episode number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-paper/40 mb-2 block">Series</label>
              <select
                value={series}
                onChange={e => setSeries(e.target.value)}
                className="lbt-input bg-ink-soft border-paper/20 text-paper"
              >
                {seriesOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-paper/40 mb-2 block">Episode number</label>
              <input
                type="number"
                value={episodeNumber}
                onChange={e => setEpisodeNumber(e.target.value)}
                placeholder="e.g. 23"
                className="lbt-input bg-ink-soft border-paper/20 text-paper placeholder:text-paper/30"
              />
            </div>
          </div>

          {/* Platform URLs */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-paper/40 block">Platform links (optional — add now or later)</label>
            {[
              { label: 'YouTube URL', val: youtubeUrl, set: setYoutubeUrl },
              { label: 'Spotify URL', val: spotifyUrl, set: setSpotifyUrl },
              { label: 'Apple Podcasts URL', val: appleUrl, set: setAppleUrl },
            ].map(f => (
              <input
                key={f.label}
                type="url"
                value={f.val}
                onChange={e => f.set(e.target.value)}
                placeholder={f.label}
                className="lbt-input bg-ink-soft border-paper/20 text-paper placeholder:text-paper/30"
              />
            ))}
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadBox
              label="Guest photo"
              preview={guestImagePreview}
              onFile={f => handleImageFile(f, 'guest')}
            />
            <ImageUploadBox
              label="Thumbnail"
              preview={thumbnailPreview}
              onFile={f => handleImageFile(f, 'thumbnail')}
            />
          </div>

          {/* Transcript */}
          <div>
            <label className="text-xs uppercase tracking-wider text-paper/40 mb-2 block">Transcript</label>
            <div
              className="border border-dashed border-paper/20 p-6 text-center mb-3 cursor-pointer hover:border-amber-lbt transition-colors"
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleTranscriptFile(f) }}
              onClick={() => document.getElementById('transcript-file')?.click()}
            >
              <p className="text-paper/40 text-sm">Drop .txt file here or click to upload</p>
              <input
                id="transcript-file"
                type="file"
                accept=".txt,.text"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleTranscriptFile(f) }}
              />
            </div>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Or paste transcript text here..."
              rows={10}
              className="lbt-input bg-ink-soft border-paper/20 text-paper placeholder:text-paper/30 font-mono text-xs resize-y"
            />
            {transcript && (
              <p className="text-xs text-paper/30 mt-1">{transcript.length.toLocaleString()} characters loaded</p>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="btn-primary bg-amber-lbt hover:bg-amber-dim w-full text-base py-4">
            Generate episode page with Claude
          </button>
        </form>
      </div>
    )
  }

  // ── STEP: GENERATING ──
  if (step === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="w-8 h-8 border-2 border-amber-lbt border-t-transparent rounded-full animate-spin mb-6" />
        <p className="font-display text-2xl text-paper mb-2">Claude is reading the transcript</p>
        <p className="text-paper/40 text-sm max-w-sm">
          Generating bio, summary, Q&A excerpts, chapters, SEO metadata, and all 13 page sections. Usually takes 20-40 seconds.
        </p>
      </div>
    )
  }

  // ── STEP: DONE ──
  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <p className="font-display text-3xl text-paper mb-2">Saved.</p>
        <p className="text-paper/40 text-sm">Redirecting to dashboard...</p>
      </div>
    )
  }

  // ── STEP: SAVING ──
  if (step === 'saving') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="w-8 h-8 border-2 border-amber-lbt border-t-transparent rounded-full animate-spin mb-6" />
        <p className="font-display text-2xl text-paper mb-2">Saving episode...</p>
      </div>
    )
  }

  // ── STEP: REVIEW ──
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-paper">Review generated page</h1>
          <p className="text-paper/40 text-sm mt-1">Edit any field before publishing.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleSave('draft')} className="btn-outline border-paper/20 text-paper/60 text-sm">
            Save as draft
          </button>
          <button onClick={() => handleSave('published')} className="btn-primary bg-amber-lbt hover:bg-amber-dim text-sm">
            Publish
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-6">{error}</p>}

      <div className="space-y-8">
        <ReviewSection label="Slug (URL)">
          <input
            value={editData.slug || ''}
            onChange={e => updateField('slug', e.target.value)}
            className="lbt-input bg-ink-soft border-paper/20 text-paper font-mono text-sm"
          />
          <p className="text-xs text-paper/30 mt-1">lifebetweentitles.com/shows/{editData.slug}</p>
        </ReviewSection>

        <ReviewSection label="Episode title (SEO)">
          <input
            value={editData.episode_title || ''}
            onChange={e => updateField('episode_title', e.target.value)}
            className="lbt-input bg-ink-soft border-paper/20 text-paper"
          />
        </ReviewSection>

        <ReviewSection label="Meta description">
          <textarea
            value={editData.meta_description || ''}
            onChange={e => updateField('meta_description', e.target.value)}
            rows={3}
            className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm"
          />
          <p className="text-xs text-paper/30 mt-1">{(editData.meta_description || '').length} / 160 chars</p>
        </ReviewSection>

        <ReviewSection label="Guest name + title">
          <div className="grid grid-cols-2 gap-3">
            <input
              value={editData.guest_name || ''}
              onChange={e => updateField('guest_name', e.target.value)}
              placeholder="Guest name"
              className="lbt-input bg-ink-soft border-paper/20 text-paper"
            />
            <input
              value={editData.guest_title || ''}
              onChange={e => updateField('guest_title', e.target.value)}
              placeholder="Guest title"
              className="lbt-input bg-ink-soft border-paper/20 text-paper"
            />
          </div>
        </ReviewSection>

        <ReviewSection label="Guest bio">
          <textarea
            value={editData.guest_bio || ''}
            onChange={e => updateField('guest_bio', e.target.value)}
            rows={4}
            className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm"
          />
        </ReviewSection>

        <ReviewSection label="Episode summary">
          <textarea
            value={editData.summary || ''}
            onChange={e => updateField('summary', e.target.value)}
            rows={4}
            className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm"
          />
        </ReviewSection>

        <ReviewSection label="Pull quote">
          <textarea
            value={editData.pull_quote || ''}
            onChange={e => updateField('pull_quote', e.target.value)}
            rows={3}
            className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm font-display italic"
          />
        </ReviewSection>

        <ReviewSection label="Key topics">
          <div className="space-y-2">
            {(editData.key_topics || []).map((t: string, i: number) => (
              <input
                key={i}
                value={t}
                onChange={e => {
                  const arr = [...(editData.key_topics || [])]
                  arr[i] = e.target.value
                  updateField('key_topics', arr)
                }}
                className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm"
              />
            ))}
          </div>
        </ReviewSection>

        <ReviewSection label="Platform links">
          <div className="space-y-2">
            {[
              { label: 'YouTube', key: 'youtube_url' },
              { label: 'Spotify', key: 'spotify_url' },
              { label: 'Apple Podcasts', key: 'apple_url' },
            ].map(f => (
              <input
                key={f.key}
                value={editData[f.key] || ''}
                onChange={e => updateField(f.key, e.target.value)}
                placeholder={f.label + ' URL'}
                className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm"
              />
            ))}
          </div>
        </ReviewSection>

        <ReviewSection label="Chapters">
          <div className="space-y-2">
            {(editData.chapters || []).map((ch: { time: string; title: string }, i: number) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                <input
                  value={ch.time}
                  onChange={e => {
                    const arr = [...(editData.chapters || [])]
                    arr[i] = { ...arr[i], time: e.target.value }
                    updateField('chapters', arr)
                  }}
                  className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm font-mono"
                />
                <input
                  value={ch.title}
                  onChange={e => {
                    const arr = [...(editData.chapters || [])]
                    arr[i] = { ...arr[i], title: e.target.value }
                    updateField('chapters', arr)
                  }}
                  className="lbt-input bg-ink-soft border-paper/20 text-paper text-sm col-span-3"
                />
              </div>
            ))}
          </div>
        </ReviewSection>
      </div>

      <div className="flex gap-3 mt-10 pt-8 border-t border-paper/10">
        <button onClick={() => handleSave('draft')} className="btn-outline border-paper/20 text-paper/60">
          Save as draft
        </button>
        <button onClick={() => handleSave('published')} className="btn-primary bg-amber-lbt hover:bg-amber-dim">
          Publish episode
        </button>
      </div>
    </div>
  )
}

function ReviewSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-paper/40 mb-2 block">{label}</label>
      {children}
    </div>
  )
}

function ImageUploadBox({
  label,
  preview,
  onFile,
}: {
  label: string
  preview: string
  onFile: (f: File) => void
}) {
  const id = label.replace(/\s+/g, '-').toLowerCase()
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-paper/40 mb-2 block">{label}</label>
      <label
        htmlFor={id}
        className="block border border-dashed border-paper/20 aspect-square cursor-pointer hover:border-amber-lbt transition-colors overflow-hidden relative"
      >
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-paper/20 text-sm">
            + {label}
          </div>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }}
        />
      </label>
    </div>
  )
}
