import { createServerClient } from '@/lib/supabase'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.lifebetweentitles.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shows`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/book`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/sponsors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/guest`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Dynamic episode pages
  try {
    const db = createServerClient()
    const { data } = await db
      .from('episodes')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    const episodePages: MetadataRoute.Sitemap = (data ?? []).map((ep: { slug: string; updated_at: string }) => ({
      url: `${base}/shows/${ep.slug}`,
      lastModified: new Date(ep.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...episodePages]
  } catch {
    return staticPages
  }
}
