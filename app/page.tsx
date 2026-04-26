import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Life Between Titles — Career Transition Stories',
  description: 'Honest conversations about career transition, professional identity, and what happens in the space between who you were and who you\'re becoming. Hosted by Savan Kong.',
}

const shows = [
  {
    slug: 'life-between-titles',
    label: 'Life Between Titles',
    description: 'Raw, honest stories from people mid-transition. The layoffs, the reinventions, the identity crises, and the unexpected second acts.',
    episodes: '22 episodes',
    color: 'bg-ink text-paper',
  },
  {
    slug: 'work-unscripted',
    label: 'Work, Unscripted',
    description: 'Conversations with people who built careers you didn\'t know were possible. Disc golfers. Surgeons. Immigration attorneys. The extraordinary paths people take.',
    episodes: '4 episodes',
    color: 'bg-amber-lbt text-paper',
  },
  {
    slug: 'office-hours',
    label: 'Office Hours',
    description: 'Practical, tactical career guidance. Resume strategy, networking, negotiation — the real stuff nobody teaches you.',
    episodes: 'Coming soon',
    color: 'bg-rust text-paper',
  },
]

const tools = [
  { label: 'Teal AI Resume Tool', desc: 'Build a job-ready resume faster', href: 'https://get.tealhq.com/zzNxQ7' },
  { label: 'Online Therapy', desc: 'Anxiety assessment and support', href: 'https://go.online-therapy.com/SHwO' },
  { label: 'Reflection Journal', desc: 'Process what\'s next on paper', href: 'https://amzn.to/4reFQSB' },
  { label: 'Sleep Supplement', desc: 'Rest through the uncertainty', href: 'https://amzn.to/46FciGe' },
  { label: "Men's Health Stack", desc: 'Stay sharp while rebuilding', href: 'https://amzn.to/40K9J29' },
]

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-paper min-h-[88vh] flex items-center border-b border-paper-warm">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div className="fade-up">
            <span className="label-tape mb-6 block w-fit">Podcast</span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-ink leading-[1.05] mb-6 text-balance">
              What happens between who you were and who you're becoming?
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed mb-10 max-w-lg">
              Real conversations about career transition, identity, and reinvention. Hosted by Savan Kong.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shows" className="btn-primary">Browse Episodes</Link>
              <a href="https://open.spotify.com/show/1olZo0VDvHh9w0F2D2vEir" target="_blank" rel="noopener noreferrer" className="btn-outline">
                Listen on Spotify
              </a>
            </div>

            {/* Listen everywhere */}
            <div className="mt-10 flex flex-wrap gap-3 items-center">
              <span className="text-xs uppercase tracking-wider text-ink-faint font-medium">Also on</span>
              {['YouTube', 'Apple Podcasts', 'Amazon Music'].map(p => (
                <span key={p} className="text-xs text-ink-muted border border-paper-warm px-3 py-1">{p}</span>
              ))}
            </div>
          </div>

          {/* Right: stat block */}
          <div className="fade-up fade-up-delay-2 grid grid-cols-2 gap-4">
            {[
              { num: '26+', label: 'Episodes' },
              { num: '3', label: 'Shows' },
              { num: '1', label: 'Book' },
              { num: '∞', label: 'Second acts' },
            ].map(s => (
              <div key={s.label} className="bg-paper-warm border border-paper-warm p-8">
                <p className="font-display text-4xl font-bold text-ink mb-1">{s.num}</p>
                <p className="text-xs uppercase tracking-wider text-ink-faint">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl font-bold text-ink tracking-tight">The shows</h2>
          <Link href="/shows" className="text-xs uppercase tracking-wider text-ink-muted hover:text-ink transition-colors">
            All episodes →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {shows.map(s => (
            <Link key={s.slug} href={`/shows?series=${s.slug}`} className={`episode-card block p-8 ${s.color}`}>
              <span className="text-xs font-medium tracking-wider uppercase opacity-60 mb-4 block">{s.episodes}</span>
              <h3 className="font-display text-xl font-semibold mb-3 leading-tight">{s.label}</h3>
              <p className="text-sm leading-relaxed opacity-80">{s.description}</p>
              <span className="mt-6 block text-xs uppercase tracking-wider opacity-60">Browse →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BOOK CTA */}
      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="label-tape mb-6 block w-fit">Now available</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              Laid Off and Lost
            </h2>
            <p className="text-paper/70 text-lg leading-relaxed mb-8">
              A guide for surviving a job loss, rediscovering your identity, and rebuilding yourself. Written by Savan Kong, drawing on every conversation from the show.
            </p>
            <Link href="/book" className="btn-primary bg-amber-lbt hover:bg-amber-dim border-none">
              Get the book
            </Link>
          </div>
          <div className="bg-ink-soft border border-paper/10 p-10">
            <p className="font-display text-xl italic text-paper/80 leading-relaxed mb-6">
              "The space between who you were and who you're becoming is not a waiting room. It's where the work actually happens."
            </p>
            <p className="text-xs uppercase tracking-wider text-paper/40">Savan Kong, Laid Off and Lost</p>
          </div>
        </div>
      </section>

      {/* ABOUT SAVAN */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-12 items-start">
        <div className="md:col-span-1">
          <div className="bg-paper-warm aspect-square flex items-center justify-center border border-paper-warm">
            <span className="font-display text-6xl font-bold text-ink/20">SK</span>
          </div>
        </div>
        <div className="md:col-span-2">
          <span className="label-tape mb-4 block w-fit">Your host</span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink mb-4">Savan Kong</h2>
          <p className="text-ink-muted leading-relaxed mb-4">
            Former federal CXO. Entrepreneur. Podcast host. Savan has navigated the space between titles more than once, including closing a business he loved and reinventing himself after decades in public service.
          </p>
          <p className="text-ink-muted leading-relaxed mb-6">
            Life Between Titles grew out of the conversations he wished he'd had during his own transitions, and the people he couldn't help when he was inside the system.
          </p>
          <Link href="/about" className="btn-outline">Read his story</Link>
        </div>
      </section>

      {/* TOOLS */}
      <section className="bg-paper-warm border-t border-paper-warm">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8">
            <span className="label-tape mb-3 block w-fit">Resources</span>
            <h2 className="font-display text-2xl font-bold text-ink tracking-tight">Tools for your transition</h2>
            <p className="text-ink-muted text-sm mt-1">Affiliate links. They cost you nothing and help support the show.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
            {tools.map(t => (
              <a
                key={t.label}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="episode-card bg-paper border border-paper-warm p-5 block"
              >
                <p className="font-medium text-sm text-ink mb-1">{t.label}</p>
                <p className="text-xs text-ink-muted leading-snug">{t.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-ink mb-4">The show is free. Your support keeps it going.</h2>
        <p className="text-ink-muted mb-8 max-w-lg mx-auto">
          No ads. No paywalls. If these conversations have meant something to you, consider buying Savan a coffee.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="https://buymeacoffee.com/lifebtwtitles" target="_blank" rel="noopener noreferrer" className="btn-primary">
            Buy me a coffee
          </a>
          <Link href="/sponsors" className="btn-outline">Become a sponsor</Link>
        </div>
      </section>
    </>
  )
}
