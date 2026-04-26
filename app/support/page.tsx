import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Support the Show',
  description: 'Life Between Titles is free. If these conversations have helped you, here\'s how to support the show.',
}

const tools = [
  {
    name: 'Teal AI Resume Tool',
    desc: 'Build a job-ready resume faster. Teal tracks applications, optimizes for ATS, and surfaces what matters to recruiters.',
    href: 'https://get.tealhq.com/zzNxQ7',
    cta: 'Try Teal',
  },
  {
    name: 'Online Therapy',
    desc: 'Career transitions are hard on your mental health. Online-Therapy offers CBT-based support with licensed therapists.',
    href: 'https://go.online-therapy.com/SHwO',
    cta: 'Anxiety assessment',
  },
  {
    name: 'Reflection Journal',
    desc: 'Processing what\'s next is easier when you write it down. This guided journal is built for exactly this kind of moment.',
    href: 'https://amzn.to/4reFQSB',
    cta: 'Get the journal',
  },
  {
    name: 'Sleep Supplement',
    desc: 'Uncertainty wrecks sleep. This supplement helps you rest through the hard parts.',
    href: 'https://amzn.to/46FciGe',
    cta: 'Shop',
  },
  {
    name: "Men's Health Stack",
    desc: 'Stay physically sharp while you rebuild. Energy, focus, and recovery when you need it most.',
    href: 'https://amzn.to/40K9J29',
    cta: 'Shop',
  },
]

export default function SupportPage() {
  return (
    <>
      <section className="bg-ink text-paper">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <span className="label-tape mb-6 block w-fit mx-auto bg-amber-lbt">Support</span>
          <h1 className="font-display text-5xl font-bold tracking-tighter mb-6 leading-tight">
            The show is free.<br />Your support keeps it going.
          </h1>
          <p className="text-paper/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            No ads. No paywalls. No algorithms deciding what you hear. If these conversations have meant something to you, here's how to give back.
          </p>
          <a
            href="https://buymeacoffee.com/lifebtwtitles"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-amber-lbt hover:bg-amber-dim border-none text-base py-4 px-12"
          >
            Buy Savan a coffee
          </a>
        </div>
      </section>

      {/* Other ways to support */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl font-bold text-ink mb-8 tracking-tight">Other ways to support</h2>
        <div className="space-y-4">
          {[
            {
              icon: '⭐',
              title: 'Leave a review on Apple Podcasts',
              desc: 'Reviews help new listeners find the show. It takes 30 seconds and it actually matters.',
              href: 'https://podcasts.apple.com/us/podcast/life-between-titles',
              cta: 'Leave a review',
            },
            {
              icon: '🔔',
              title: 'Subscribe on YouTube',
              desc: 'Subscribe and hit the bell. Every subscriber helps the algorithm surface these conversations to people who need them.',
              href: 'https://www.youtube.com/@LifeBetweenTitles',
              cta: 'Subscribe',
            },
            {
              icon: '📝',
              title: 'Subscribe on Substack',
              desc: 'Get the newsletter. Essays, episode notes, and the things Savan is thinking about between recordings.',
              href: 'https://substack.com/@lifebetweentitles',
              cta: 'Subscribe free',
            },
            {
              icon: '🗣️',
              title: 'Share an episode',
              desc: 'Know someone who\'s mid-transition right now? Send them an episode. That\'s the whole thing.',
              href: '/shows',
              cta: 'Browse episodes',
            },
          ].map(item => (
            <div key={item.title} className="bg-paper-warm border border-paper-warm p-6 flex items-start gap-5">
              <span className="text-2xl flex-shrink-0 mt-0.5" style={{ fontSize: 20 }}>{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink mb-1">{item.title}</p>
                <p className="text-sm text-ink-muted leading-relaxed mb-3">{item.desc}</p>
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-xs uppercase tracking-wider text-amber-lbt hover:text-amber-dim transition-colors font-medium"
                >
                  {item.cta} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate tools */}
      <section className="bg-paper-warm border-t border-paper-warm">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8">
            <span className="label-tape mb-3 block w-fit">Affiliate links</span>
            <h2 className="font-display text-2xl font-bold text-ink tracking-tight">Tools for your transition</h2>
            <p className="text-ink-muted text-sm mt-1 max-w-xl">
              These links cost you nothing. When you use them, a small commission comes back to the show. Savan only lists tools he'd actually recommend.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tools.map(t => (
              <div key={t.name} className="bg-paper border border-paper-warm p-6 episode-card">
                <p className="font-display text-base font-semibold text-ink mb-2">{t.name}</p>
                <p className="text-sm text-ink-muted leading-relaxed mb-4">{t.desc}</p>
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-wider text-amber-lbt hover:text-amber-dim transition-colors font-medium"
                >
                  {t.cta} →
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-faint mt-6">
            Some links above are affiliate links. They cost you nothing and help support the show.
          </p>
        </div>
      </section>

      {/* Sponsor CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-ink-muted mb-2">Want a deeper partnership?</p>
        <h3 className="font-display text-2xl font-bold text-ink mb-6">Sponsor the show</h3>
        <Link href="/sponsors" className="btn-primary">See sponsorship options</Link>
      </section>
    </>
  )
}
