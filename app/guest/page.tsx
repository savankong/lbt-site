'use client'
import { useState } from 'react'
import Link from 'next/link'

const shows = [
  { value: 'life-between-titles', label: 'Life Between Titles', desc: 'You\'ve been through a real career transition. Layoff, pivot, reinvention, identity loss. You have a story worth telling.' },
  { value: 'work-unscripted', label: 'Work, Unscripted', desc: 'You built an unusual career — one most people couldn\'t imagine as a job. Professional, unconventional, or both.' },
  { value: 'office-hours', label: 'Office Hours', desc: 'You have practical expertise on career strategy, job searching, negotiation, or workplace navigation.' },
]

export default function GuestPage() {
  const [form, setForm] = useState({ name: '', title: '', email: '', linkedin_url: '', show: '', transition_story: '', why_lbt: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  function update(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'guest', ...form }),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section className="bg-paper border-b border-paper-warm">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <span className="label-tape mb-4 block w-fit">Guest submissions</span>
          <h1 className="font-display text-5xl font-bold tracking-tighter text-ink mb-6">Be a guest</h1>
          <p className="text-ink-muted text-lg max-w-2xl leading-relaxed">
            Life Between Titles is built on real stories. If you've been through something worth talking about, Savan wants to hear it.
          </p>
        </div>
      </section>

      {/* Show options */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="font-display text-xl font-bold text-ink mb-6 tracking-tight">Three shows, one question: what's your story?</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {shows.map(s => (
            <div key={s.value} className="bg-paper-warm border border-paper-warm p-6">
              <p className="font-display text-base font-semibold text-ink mb-2">{s.label}</p>
              <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* What to expect */}
        <div className="bg-ink text-paper p-8 mb-12">
          <h3 className="font-display text-xl font-semibold mb-4">What to expect</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-paper/70">
            {[
              'Conversations run 45-75 minutes over video call.',
              'Savan sends questions in advance. No surprises.',
              'You don\'t need a polished story. Real is better.',
              'Episodes go out on YouTube, Spotify, Apple, and Amazon Music.',
              'You\'ll get the episode link and social assets when it publishes.',
              'No PR pitches. No product placement. Just conversation.',
            ].map(item => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-amber-lbt mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-ink mb-2 tracking-tight">Submit your story</h2>
          <p className="text-ink-muted text-sm mb-8">Takes about 5 minutes. Savan reads every submission himself.</p>

          {status === 'done' ? (
            <div className="bg-paper-warm border border-paper-warm p-8 text-center">
              <p className="font-display text-xl text-ink mb-2">Submitted.</p>
              <p className="text-ink-muted text-sm mb-4">Savan will reach out if there's a fit. Thanks for sharing.</p>
              <Link href="/shows" className="btn-outline text-sm">Browse episodes</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Your name</label>
                  <input required value={form.name} onChange={e => update('name', e.target.value)} className="lbt-input" placeholder="First Last" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Current title or role</label>
                  <input required value={form.title} onChange={e => update('title', e.target.value)} className="lbt-input" placeholder="What you do now" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Email</label>
                <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} className="lbt-input" placeholder="you@email.com" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">LinkedIn (optional)</label>
                <input type="url" value={form.linkedin_url} onChange={e => update('linkedin_url', e.target.value)} className="lbt-input" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Which show fits best?</label>
                <select required value={form.show} onChange={e => update('show', e.target.value)} className="lbt-input">
                  <option value="">Select a show</option>
                  {shows.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Tell us your transition story</label>
                <textarea
                  required
                  value={form.transition_story}
                  onChange={e => update('transition_story', e.target.value)}
                  rows={5}
                  className="lbt-input resize-y"
                  placeholder="What happened? What did you lose? What did you find? Don't polish it."
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Why Life Between Titles? (optional)</label>
                <textarea
                  value={form.why_lbt}
                  onChange={e => update('why_lbt', e.target.value)}
                  rows={3}
                  className="lbt-input resize-y"
                  placeholder="Why does this show feel like the right place for your story?"
                />
              </div>
              {status === 'error' && <p className="text-red-500 text-sm">Something went wrong. Try again.</p>}
              <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full py-4">
                {status === 'submitting' ? 'Submitting...' : 'Submit your story'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
