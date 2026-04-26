import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <span className="label-tape mb-6 block w-fit mx-auto">404</span>
      <h1 className="font-display text-5xl font-bold text-ink mb-4 tracking-tight">
        Page not found
      </h1>
      <p className="text-ink-muted text-lg mb-10 max-w-md">
        The in-between can feel like this. But there's always somewhere to go next.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-primary">Go home</Link>
        <Link href="/shows" className="btn-outline">Browse episodes</Link>
      </div>
    </div>
  )
}
