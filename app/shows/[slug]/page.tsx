import { createServerClient } from '@/lib/supabase'
import type { Episode } from '@/lib/supabase'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

async function getEpisode(slug: string): Promise<Episode | null> {
  const db = createServerClient()
  const { data } = await db
    .from('episodes')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data as Episode | null
}

// Generate static params for all published episodes
export async function generateStaticParams() {
  const db = createServerClient()
  const { data } = await db.from('episodes').select('slug').eq('status', 'published')
  return (data ?? []).map((ep: { slug: string }) => ({ slug: ep.slug }))
}

// Dynamic SEO metadata per episode
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ep = await getEpisode(params.slug)
  if (!ep) return { title: 'Episode not found' }

  const seriesLabel =
    ep.series === 'life-between-titles'
      ? 'Life Between Titles'
      : ep.series === 'work-unscripted'
      ? 'Work, Unscripted'
      : 'Office Hours'

  return {
    title: ep.episode_title,
    description: ep.meta_description,
    openGraph: {
      title: ep.episode_title,
      description: ep.meta_description,
      type: 'article',
      images: ep.thumbnail_url ? [{ url: ep.thumbnail_url }] : [],
    },
    alternates: {
      canonical: `https://www.lifebetweentitles.com/shows/${ep.slug}`,
    },
    other: {
      'article:section': seriesLabel,
    },
  }
}

const seriesInfo = {
  'life-between-titles': { label: 'Life Between Titles', short: 'LBT' },
  'work-unscripted': { label: 'Work, Unscripted', short: 'WU' },
  'office-hours': { label: 'Office Hours', short: 'OH' },
}

export default async function EpisodePage({ params }: Props) {
  const ep = await getEpisode(params.slug)
  if (!ep) notFound()

  const series = seriesInfo[ep.series]

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: ep.episode_title,
    description: ep.meta_description,
    url: `https://www.lifebetweentitles.com/shows/${ep.slug}`,
    episodeNumber: ep.episode_number,
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: series.label,
      url: 'https://www.lifebetweentitles.com/shows',
    },
    author: {
      '@type': 'Person',
      name: 'Savan Kong',
      url: 'https://www.lifebetweentitles.com/about',
    },
    image: ep.thumbnail_url || undefined,
  }

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="bg-paper border-b border-paper-warm">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="label-tape">{series.short}</span>
              <span className="text-xs text-ink-faint uppercase tracking-wider">Ep. {ep.episode_number}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4 text-balance">
              {ep.episode_title}
            </h1>
            <p className="text-ink-muted text-lg mb-8">{ep.guest_title}</p>

            {/* Listen links */}
            <div className="flex flex-wrap gap-3">
              {ep.youtube_url && (
                <a href={ep.youtube_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-3 px-6">
                  Watch on YouTube
                </a>
              )}
              {ep.spotify_url && (
                <a href={ep.spotify_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-3 px-6">
                  Spotify
                </a>
              )}
              {ep.apple_url && (
                <a href={ep.apple_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-3 px-6">
                  Apple
                </a>
              )}
            </div>
          </div>

          {/* Guest photo */}
          <div className="relative aspect-square bg-paper-warm">
            {ep.guest_image_url ? (
              <Image
                src={ep.guest_image_url}
                alt={ep.guest_name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display text-6xl font-bold text-ink/10">
                  {ep.guest_name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-16 py-16">
          {/* Main content */}
          <div className="md:col-span-2 space-y-14">

            {/* Guest bio */}
            <section>
              <SectionLabel>About {ep.guest_name}</SectionLabel>
              <p className="text-ink leading-relaxed text-lg">{ep.guest_bio}</p>
            </section>

            {/* Field explainer */}
            {ep.guest_field_explainer && (
              <section>
                <SectionLabel>What is this work?</SectionLabel>
                <p className="text-ink-muted leading-relaxed">{ep.guest_field_explainer}</p>
              </section>
            )}

            {/* Episode summary */}
            <section>
              <SectionLabel>About this episode</SectionLabel>
              <p className="text-ink leading-relaxed">{ep.summary}</p>
            </section>

            {/* Key topics */}
            {ep.key_topics?.length > 0 && (
              <section>
                <SectionLabel>What we cover</SectionLabel>
                <ul className="space-y-2">
                  {ep.key_topics.map((topic: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-ink-muted">
                      <span className="text-amber-lbt mt-1 flex-shrink-0">—</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Pull quote */}
            {ep.pull_quote && (
              <section>
                <blockquote className="border-l-2 border-amber-lbt pl-6 py-2">
                  <p className="font-display text-xl italic text-ink leading-relaxed mb-3">
                    "{ep.pull_quote}"
                  </p>
                  <cite className="text-xs uppercase tracking-wider text-ink-faint not-italic">
                    {ep.guest_name}
                  </cite>
                </blockquote>
                <div className="mt-4">
                  <a
                    href="https://substack.com/@lifebetweentitles"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wider text-amber-lbt hover:underline"
                  >
                    Subscribe on Substack for more →
                  </a>
                </div>
              </section>
            )}

            {/* Q&A excerpts */}
            {ep.qa_excerpts?.length > 0 && (
              <section>
                <SectionLabel>From the conversation</SectionLabel>
                <div className="space-y-8">
                  {ep.qa_excerpts.map((qa: { question: string; answer: string }, i: number) => (
                    <div key={i}>
                      <p className="text-xs uppercase tracking-wider text-amber-lbt mb-2 font-medium">
                        Savan asked
                      </p>
                      <p className="font-medium text-ink mb-3 text-lg leading-snug">{qa.question}</p>
                      <p className="text-ink-muted leading-relaxed">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Career path */}
            {ep.career_path && (
              <section>
                <SectionLabel>How {ep.guest_name} got here</SectionLabel>
                <p className="text-ink-muted leading-relaxed">{ep.career_path}</p>
              </section>
            )}

            {/* What makes this career different */}
            {ep.what_makes_different && (
              <section>
                <SectionLabel>What makes this career different</SectionLabel>
                <p className="text-ink-muted leading-relaxed">{ep.what_makes_different}</p>
              </section>
            )}

            {/* Story bullets */}
            {ep.story_bullets?.length > 0 && (
              <section>
                <SectionLabel>In this episode</SectionLabel>
                <ul className="space-y-3">
                  {ep.story_bullets.map((bullet: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-ink-muted">
                      <span className="text-amber-lbt mt-1 flex-shrink-0">→</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Chapters */}
            {ep.chapters?.length > 0 && (
              <section>
                <SectionLabel>Episode chapters</SectionLabel>
                <div className="space-y-2">
                  {ep.chapters.map((ch: { time: string; title: string }, i: number) => (
                    <div key={i} className="flex gap-4 items-baseline">
                      <span className="font-mono text-xs text-amber-lbt w-14 flex-shrink-0">{ch.time}</span>
                      <span className="text-ink-muted text-sm">{ch.title}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <aside className="space-y-8">

            {/* Listen links */}
            <div className="bg-paper-warm p-6">
              <p className="text-xs uppercase tracking-wider text-ink-faint mb-4 font-medium">Listen on</p>
              <div className="space-y-3">
                {ep.youtube_url && <ListenLink href={ep.youtube_url} label="YouTube" />}
                {ep.spotify_url && <ListenLink href={ep.spotify_url} label="Spotify" />}
                {ep.apple_url && <ListenLink href={ep.apple_url} label="Apple Podcasts" />}
              </div>
            </div>

            {/* Support */}
            <div className="bg-ink text-paper p-6">
              <p className="text-xs uppercase tracking-wider text-paper/40 mb-3 font-medium">Support the show</p>
              <p className="text-sm text-paper/70 mb-4 leading-relaxed">
                If this conversation meant something, consider buying Savan a coffee.
              </p>
              <a
                href="https://buymeacoffee.com/lifebtwtitles"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary bg-amber-lbt hover:bg-amber-dim border-none text-xs w-full text-center block"
              >
                Buy me a coffee
              </a>
            </div>

            {/* Tools */}
            <div className="bg-paper-warm p-6">
              <p className="text-xs uppercase tracking-wider text-ink-faint mb-4 font-medium">Tools for your transition</p>
              <div className="space-y-3">
                {[
                  { label: 'Teal AI Resume', href: 'https://get.tealhq.com/zzNxQ7' },
                  { label: 'Online Therapy', href: 'https://go.online-therapy.com/SHwO' },
                  { label: 'Reflection Journal', href: 'https://amzn.to/4reFQSB' },
                ].map(t => (
                  <a
                    key={t.label}
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-ink-muted hover:text-ink transition-colors"
                  >
                    {t.label} →
                  </a>
                ))}
              </div>
              <p className="text-xs text-ink-faint mt-4">Affiliate links. Cost you nothing.</p>
            </div>

            {/* Browse more */}
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-faint mb-3 font-medium">Browse more episodes</p>
              <Link href="/shows" className="btn-outline text-xs w-full text-center block">
                All episodes →
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-semibold text-ink mb-4 pb-3 border-b border-paper-warm">
      {children}
    </h2>
  )
}

function ListenLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between text-sm text-ink hover:text-amber-lbt transition-colors group"
    >
      <span>{label}</span>
      <span className="text-ink-faint group-hover:text-amber-lbt">→</span>
    </a>
  )
}
