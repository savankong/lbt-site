import Link from 'next/link'

const listen = [
  { label: 'YouTube', href: 'https://www.youtube.com/@LifeBetweenTitles' },
  { label: 'Spotify', href: 'https://open.spotify.com/show/1olZo0VDvHh9w0F2D2vEir' },
  { label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/life-between-titles' },
  { label: 'Amazon Music', href: 'https://music.amazon.com/podcasts/389edb76-ac7c-41f3-ab48-81b70c09f500' },
]

const community = [
  { label: 'Substack', href: 'https://substack.com/@lifebetweentitles' },
  { label: 'LinkedIn', href: 'http://www.linkedin.com/company/life-between-titles' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@lifebetweentitles' },
  { label: 'Instagram', href: 'https://www.instagram.com/lifebetweentitles/' },
]

const site = [
  { label: 'Shows', href: '/shows' },
  { label: 'Book', href: '/book' },
  { label: 'About', href: '/about' },
  { label: 'Become a Sponsor', href: '/sponsors' },
  { label: 'Be a Guest', href: '/guest' },
  { label: 'Support the Show', href: '/support' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/70 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-paper text-xl mb-3">Life Between Titles</p>
            <p className="text-sm leading-relaxed text-paper/50 mb-4">
              Honest conversations about what happens between who you were and who you're becoming.
            </p>
            <a
              href="https://buymeacoffee.com/lifebtwtitles"
              target="_blank"
              rel="noopener noreferrer"
              className="label-tape bg-amber-lbt hover:bg-amber-dim transition-colors text-xs"
            >
              Buy me a coffee
            </a>
          </div>

          {/* Listen */}
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-paper/40 mb-4">Listen</p>
            <ul className="space-y-2">
              {listen.map(l => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm hover:text-paper transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-paper/40 mb-4">Community</p>
            <ul className="space-y-2">
              {community.map(l => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm hover:text-paper transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-paper/40 mb-4">Site</p>
            <ul className="space-y-2">
              {site.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm hover:text-paper transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-paper/10 pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-paper/30">
          <p>© {new Date().getFullYear()} Life Between Titles. All rights reserved.</p>
          <p>
            Some links are affiliate links. They cost you nothing and help support the show.
          </p>
        </div>
      </div>
    </footer>
  )
}
