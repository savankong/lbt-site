import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="border-b border-paper/10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="label-tape text-xs">Admin</span>
            <span className="font-display text-sm text-paper/60">Life Between Titles</span>
          </div>
          <a href="/" className="text-xs text-paper/40 hover:text-paper transition-colors uppercase tracking-wider">
            View site →
          </a>
        </div>
      </div>
      {children}
    </div>
  )
}
