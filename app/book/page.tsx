import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Laid Off and Lost — The Book',
  description: 'Laid Off and Lost by Savan Kong. A guide for surviving a job loss, rediscovering your identity, and rebuilding yourself. Available now at lifebetweentitles.com.',
}

const chapters = [
  { num: '01', title: 'The day the title disappears' },
  { num: '02', title: 'Who you were at work' },
  { num: '03', title: 'The grief nobody names' },
  { num: '04', title: 'What the in-between actually looks like' },
  { num: '05', title: 'Rebuilding without a roadmap' },
  { num: '06', title: 'The identity problem' },
  { num: '07', title: 'What the guests taught me' },
  { num: '08', title: 'Your next chapter' },
]

const guests = [
  { name: 'Ringo Nishioka', desc: 'Resume strategy that actually works' },
  { name: 'Cheryl Dillon', desc: 'The gift hidden inside forced change' },
  { name: 'Jason Briefel', desc: 'Believing in systems that fail you' },
  { name: 'Tre Wright', desc: 'Inviting feedback without shutting it down' },
  { name: 'Jordan Swanson', desc: 'Restoring the possibility of belonging' },
  { name: 'Nate Sexton', desc: 'Building a career you never dared to name' },
]

export default function BookPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="label-tape mb-6 block w-fit bg-amber-lbt">Now available</span>
            <h1 className="font-display text-6xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
              Laid Off<br />and Lost
            </h1>
            <p className="text-paper/70 text-xl mb-3 font-display italic">
              How to Survive a Job Loss, Rediscover Your Identity, and Rebuild Yourself
            </p>
            <p className="text-paper/50 text-sm mb-10">By Savan Kong</p>
            <a
              href="https://www.lifebetweentitles.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-amber-lbt hover:bg-amber-dim border-none text-base py-4 px-10"
            >
              Get the book
            </a>
          </div>

          {/* Book cover placeholder */}
          <div className="aspect-[3/4] bg-ink-soft border border-paper/10 flex flex-col items-center justify-center p-12 text-center">
            <p className="font-display text-3xl font-bold text-paper mb-3">Laid Off<br />and Lost</p>
            <div className="w-12 h-px bg-amber-lbt my-4" />
            <p className="font-display text-sm italic text-paper/50">Savan Kong</p>
          </div>
        </div>
      </section>

      {/* About the book */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <span className="label-tape mb-6 block w-fit">About the book</span>
        <div className="space-y-6 text-ink-muted leading-relaxed text-lg">
          <p>
            Losing a job doesn't just take away income. It takes away the answer to "what do you do?" It takes away your schedule, your community, your sense of forward motion. For a lot of people, it takes away the clearest part of their identity.
          </p>
          <p>
            <em>Laid Off and Lost</em> is the book Savan Kong wrote after recording more than two dozen conversations about exactly this. It draws on the guests, the patterns, and the things people said when they finally stopped performing certainty.
          </p>
          <p>
            It won't tell you to update your LinkedIn or reframe your weaknesses as strengths. It's about the harder work — figuring out who you are when the title is gone and what you actually want to build next.
          </p>
        </div>
      </section>

      {/* Chapter list */}
      <section className="bg-paper-warm border-t border-b border-paper-warm">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <span className="label-tape mb-8 block w-fit">Inside the book</span>
          <div className="grid sm:grid-cols-2 gap-4">
            {chapters.map(ch => (
              <div key={ch.num} className="flex items-baseline gap-4 py-3 border-b border-paper-warm">
                <span className="font-mono text-xs text-amber-lbt w-8 flex-shrink-0">{ch.num}</span>
                <span className="text-ink font-medium">{ch.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured guests */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <span className="label-tape mb-8 block w-fit">Voices from the show</span>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {guests.map(g => (
            <div key={g.name} className="bg-paper-warm border border-paper-warm p-6">
              <p className="font-display text-base font-semibold text-ink mb-1">{g.name}</p>
              <p className="text-xs text-ink-muted leading-snug">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-ink text-paper">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <blockquote className="font-display text-2xl md:text-3xl italic leading-relaxed text-paper/90 mb-8">
            "The space between who you were and who you're becoming is not a waiting room. It's where the work actually happens."
          </blockquote>
          <a
            href="https://www.lifebetweentitles.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-amber-lbt hover:bg-amber-dim border-none"
          >
            Get the book
          </a>
        </div>
      </section>

      {/* Also listen */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-ink-muted mb-6">The conversations that inspired the book are still going.</p>
        <Link href="/shows" className="btn-outline">Browse all episodes</Link>
      </section>
    </>
  )
}
