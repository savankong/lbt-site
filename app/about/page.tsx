import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Savan Kong is the host of Life Between Titles, a podcast about career transition, identity, and reinvention. Former federal CXO, entrepreneur, and author of Laid Off and Lost.',
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-paper border-b border-paper-warm">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="label-tape mb-4 block w-fit">Host</span>
            <h1 className="font-display text-5xl font-bold tracking-tighter text-ink mb-6 leading-tight">
              Savan Kong
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed">
              Podcast host. Author. Former federal executive. He's been between titles more than once, and he built this show because of the people he couldn't help when he was inside the system.
            </p>
          </div>
          <div className="bg-paper-warm aspect-square flex items-center justify-center border border-paper-warm">
            <span className="font-display text-8xl font-bold text-ink/10">SK</span>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-8 text-ink-muted leading-relaxed text-lg">
          <p>
            Savan spent years inside the Department of Defense as the first Customer Experience Officer within the CIO office, spanning three administrations. He built programs, led teams, and tried to make federal systems work better for the people who depended on them.
          </p>
          <p>
            He also owned and closed a brick-and-mortar toy store. That one taught him things no government job could.
          </p>
          <p>
            Life Between Titles grew out of a specific weight he still carries: the people from his DOD years he saw struggling through transitions and couldn't reach. The system didn't have room for the real conversation. So he made one.
          </p>
          <p>
            The show is three formats now. <em>Life Between Titles</em> is the career transition stories, the raw ones. <em>Work, Unscripted</em> is for people who built careers you didn't know were possible. <em>Office Hours</em> is the practical stuff, the things nobody teaches you about navigating a career.
          </p>
          <p>
            His book, <em>Laid Off and Lost</em>, draws on every conversation from the show. It's a guide for surviving a job loss, rediscovering your identity, and rebuilding yourself.
          </p>
          <p>
            He's 46. He thinks often about fatherhood, staying curious, and what it means to keep showing up when the title is gone.
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-paper-warm grid sm:grid-cols-3 gap-6">
          <Link href="/shows" className="bg-paper-warm border border-paper-warm p-6 block episode-card">
            <p className="text-xs uppercase tracking-wider text-ink-faint mb-2">Explore</p>
            <p className="font-display text-lg font-semibold text-ink">The shows</p>
          </Link>
          <Link href="/book" className="bg-paper-warm border border-paper-warm p-6 block episode-card">
            <p className="text-xs uppercase tracking-wider text-ink-faint mb-2">Read</p>
            <p className="font-display text-lg font-semibold text-ink">Laid Off and Lost</p>
          </Link>
          <Link href="/guest" className="bg-paper-warm border border-paper-warm p-6 block episode-card">
            <p className="text-xs uppercase tracking-wider text-ink-faint mb-2">Join</p>
            <p className="font-display text-lg font-semibold text-ink">Be a guest</p>
          </Link>
        </div>
      </section>
    </>
  )
}
