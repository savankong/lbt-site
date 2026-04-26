import { createServerClient } from '@/lib/supabase'
import type { Episode } from '@/lib/supabase'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Shows',
  description: 'Browse all episodes of Life Between Titles, Work Unscripted, and Office Hours. Real conversations about career transition, reinvention, and what comes next.',
}

const seriesInfo = {
  'life-between-titles': { label: 'Life Between Titles', short: 'LBT', color: 'bg-ink text-paper' },
  'work-unscripted': { label: 'Work, Unscripted', short: 'WU', color: 'bg-amber-lbt text-paper' },
  'office-hours': { label: 'Office Hours', short: 'OH', color: 'bg-rust text-paper' },
}

async function getEpisodes(series?: string): Promise<Episode[]> {
  const db = createServerClient()
  let query = db
    .from('episodes')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (series && series in seriesInfo) {
    query = query.eq('series', series)
  }

  const { data } = await query
  return (data as Episode[]) ?? []
}

export default async function ShowsPage({
  searchParams,
}: {
  searchParams: { series?: string }
}) {
  const activeSeries = searchParams.series
  const episodes = await getEpisodes(activeSeries)

  return (
    <>
      {/* Header */}
      <section className="bg-paper border-b border-paper-warm">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <span className="label-tape mb-4 block w-fit">All episodes</span>
          <h1 className="font-display text-5xl font-bold tracking-tighter text-ink mb-6">The shows</h1>
          <p className="text-ink-muted text-lg max-w-2xl">
            Three formats. One through line. What happens when people stop performing certainty and start telling the truth about their careers.
          </p>

          {/* Series filter */}
          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="/shows"
              className={`text-xs uppercase tracking-wider font-medium px-4 py-2 border transition-colors ${
                !activeSeries
                  ? 'bg-ink text-paper border-ink'
                  : 'border-paper-warm text-ink-muted hover:border-ink hover:text-ink'
              }`}
            >
              All
            </Link>
            {Object.entries(seriesInfo).map(([key, val]) => (
              <Link
                key={key}
                href={`/shows?series=${key}`}
                className={`text-xs uppercase tracking-wider font-medium px-4 py-2 border transition-colors ${
                  activeSeries === key
                    ? 'bg-ink text-paper border-ink'
                    : 'border-paper-warm text-ink-muted hover:border-ink hover:text-ink'
                }`}
              >
                {val.short}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Episode grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {episodes.length === 0 ? (
          <div className="text-center py-20 text-ink-muted">
            <p className="font-display text-2xl mb-2">No episodes yet</p>
            <p className="text-sm">Check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function EpisodeCard({ episode: ep }: { episode: Episode }) {
  const series = seriesInfo[ep.series]

  return (
    <Link
      href={`/shows/${ep.slug}`}
      className="episode-card block bg-paper border border-paper-warm group"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-paper-warm relative overflow-hidden">
        {ep.thumbnail_url ? (
          <Image
            src={ep.thumbnail_url}
            alt={ep.episode_title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-3xl font-bold text-ink/10">
              {ep.guest_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        {/* Series badge */}
        <span className={`absolute top-3 left-3 label-tape text-xs ${series.color}`}>
          {series.short}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs text-ink-faint uppercase tracking-wider mb-2">
          Ep. {ep.episode_number} — {ep.guest_title}
        </p>
        <h3 className="font-display text-lg font-semibold text-ink leading-tight mb-3 group-hover:text-amber-lbt transition-colors">
          {ep.episode_title}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">
          {ep.summary}
        </p>
        <span className="mt-4 block text-xs uppercase tracking-wider text-amber-lbt font-medium">
          Listen →
        </span>
      </div>
    </Link>
  )
}
