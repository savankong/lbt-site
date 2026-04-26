'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/shows', label: 'Shows' },
  { href: '/book', label: 'Book' },
  { href: '/about', label: 'About' },
  { href: '/support', label: 'Support' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-paper-warm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink">
          Life Between Titles
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors tracking-wide uppercase text-xs"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/guest" className="btn-outline text-xs py-2 px-5">
            Be a Guest
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-paper border-t border-paper-warm px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink-muted hover:text-ink tracking-wider uppercase"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/guest" onClick={() => setOpen(false)} className="btn-primary text-center mt-2">
            Be a Guest
          </Link>
        </div>
      )}
    </header>
  )
}
