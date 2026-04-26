'use client'
import { useState } from 'react'
import type { Metadata } from 'next'

const packages = [
  {
    name: 'Episode sponsor',
    price: 'Custom',
    desc: 'Your brand mentioned in the episode intro, outro, and all show notes across YouTube, Spotify, Apple, and Amazon Music.',
    includes: ['Host-read mention', 'Show notes placement', 'Episode description link', 'Social post tag'],
  },
  {
    name: 'Series partner',
    price: 'Custom',
    desc: 'Sponsor an entire series run. Consistent brand presence across multiple episodes with a deeper association to the content and community.',
    includes: ['Everything in Episode', 'Series-level branding', 'Website placement', 'Newsletter mention'],
  },
  {
    name: 'Brand alignment',
    price: 'Custom',
    desc: 'A longer-term partnership built around content alignment. For brands whose mission connects to career transition, mental health, or professional identity.',
    includes: ['Everything in Series', 'Dedicated content piece', 'Cross-platform campaign', 'Direct collaboration with Savan'],
    featured: true,
  },
]

export default function SponsorsPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', website: '', budget_range: '', message: '' })
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
        body: JSON.stringify({ type: 'sponsor', ...form }),
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
          <span className="label-tape mb-4 block w-fit">Sponsorship</span>
          <h1 className="font-display text-5xl font-bold tracking-tighter text-ink mb-6">Become a sponsor</h1>
          <p className="text-ink-muted text-lg max-w-2xl leading-relaxed">
            Life Between Titles reaches people in active career transition. They're making decisions about tools, services, and support. If your brand belongs in that moment, let's talk.
          </p>
        </div>
      </section>

      {/* Audience stats */}
      <section className="bg-paper-warm border-b border-paper-warm">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: '26+', label: 'Episodes published' },
            { num: '4', label: 'Platforms' },
            { num: '3', label: 'Show formats' },
            { num: '100%', label: 'Host-read only' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold text-ink mb-1">{s.num}</p>
              <p className="text-xs uppercase tracking-wider text-ink-faint">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl font-bold text-ink mb-8 tracking-tight">Sponsorship options</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div
              key={pkg.name}
              className={`border p-8 ${pkg.featured ? 'border-amber-lbt bg-paper' : 'border-paper-warm bg-paper-warm'}`}
            >
              {pkg.featured && <span className="label-tape mb-4 block w-fit text-xs">Most popular</span>}
              <p className="font-display text-xl font-semibold text-ink mb-1">{pkg.name}</p>
              <p className="text-xs text-amber-lbt uppercase tracking-wider mb-4">{pkg.price}</p>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">{pkg.desc}</p>
              <ul className="space-y-2">
                {pkg.includes.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink-muted">
                    <span className="text-amber-lbt text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Intake form */}
      <section className="bg-paper-warm border-t border-paper-warm">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl font-bold text-ink mb-2 tracking-tight">Get in touch</h2>
          <p className="text-ink-muted text-sm mb-8">Tell us about your brand and what you're looking for. Savan responds personally.</p>

          {status === 'done' ? (
            <div className="bg-paper border border-paper-warm p-8 text-center">
              <p className="font-display text-xl text-ink mb-2">Got it.</p>
              <p className="text-ink-muted text-sm">Savan will be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Your name</label>
                  <input required value={form.name} onChange={e => update('name', e.target.value)} className="lbt-input" placeholder="First Last" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Company</label>
                  <input required value={form.company} onChange={e => update('company', e.target.value)} className="lbt-input" placeholder="Acme Co." />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Email</label>
                <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} className="lbt-input" placeholder="you@company.com" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Website</label>
                <input type="url" value={form.website} onChange={e => update('website', e.target.value)} className="lbt-input" placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Budget range</label>
                <select value={form.budget_range} onChange={e => update('budget_range', e.target.value)} className="lbt-input">
                  <option value="">Select a range</option>
                  <option>Under $500</option>
                  <option>$500 — $1,500</option>
                  <option>$1,500 — $5,000</option>
                  <option>$5,000+</option>
                  <option>Open to discuss</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-ink-faint mb-1 block">Tell us about your brand</label>
                <textarea required value={form.message} onChange={e => update('message', e.target.value)} rows={4} className="lbt-input resize-y" placeholder="What you do, who you serve, what you're hoping to accomplish..." />
              </div>
              {status === 'error' && <p className="text-red-500 text-sm">Something went wrong. Try emailing directly.</p>}
              <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full py-4">
                {status === 'submitting' ? 'Sending...' : 'Send inquiry'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
