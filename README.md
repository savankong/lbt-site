# Life Between Titles — Website

Built with Next.js 14, Tailwind CSS, Supabase, and the Anthropic API.

---

## Setup (one time)

### 1. Supabase
1. Create a free project at https://supabase.com
2. Go to SQL Editor and run the contents of `lib/schema.sql`
3. Copy your project URL and keys from Settings → API

### 2. Environment variables
Copy `.env.local.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ADMIN_PASSWORD=
```

### 3. Install and run
```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to https://vercel.com → New Project → Import your repo
3. Add all environment variables from `.env.local`
4. Deploy

Vercel auto-deploys on every push to main. Your sitemap will be live at `/sitemap.xml`.

---

## Admin panel

Go to `/admin` on your live site. Enter your `ADMIN_PASSWORD`.

### Publishing a new episode
1. Click **+ New episode**
2. Set series and episode number
3. Add platform links (YouTube, Spotify, Apple) — optional now, add later in edit
4. Upload guest photo and thumbnail (optional, add later)
5. Drop in your `.txt` transcript file or paste the text
6. Click **Generate episode page with Claude**
7. Wait ~30 seconds
8. Review every field — edit anything that needs work
9. Click **Save as draft** or **Publish**

### Editing an existing episode
1. From the dashboard, click **Edit** next to any episode
2. Update any field
3. Click **Save**
4. Toggle publish/unpublish with the button top right

---

## SEO notes

- Every episode page gets its own `<title>`, `<meta description>`, Open Graph tags, and JSON-LD structured data automatically
- The sitemap at `/sitemap.xml` updates automatically when you publish new episodes
- The 301 redirect from `/about-lbt` to `/` is in `next.config.js` — add more there as needed
- To set up Google Search Console: go to https://search.google.com/search-console → Add property → `https://www.lifebetweentitles.com` → verify with the HTML tag method (add the tag to `app/layout.tsx` under `<head>`)

---

## File structure

```
app/
  page.tsx              — Homepage
  layout.tsx            — Root layout, nav, footer
  globals.css           — Design system, fonts, utilities
  shows/
    page.tsx            — Episode listing with series filter
    [slug]/page.tsx     — Individual episode page (all 13 SEO sections)
  about/page.tsx
  book/page.tsx
  sponsors/page.tsx
  guest/page.tsx
  support/page.tsx
  admin/
    page.tsx            — Dashboard (password-gated)
    layout.tsx
    new-episode/page.tsx — Transcript upload + AI generation + review
    episodes/[slug]/page.tsx — Edit existing episode
  api/
    process-transcript/route.ts — AI engine (Anthropic API)
    episodes/route.ts           — Save/fetch episodes (Supabase)
    upload/route.ts             — Image uploads (Supabase Storage)
    contact/route.ts            — Sponsor + guest form submissions
  sitemap.ts            — Auto-generated sitemap including all published episodes
  robots.ts             — Blocks /admin and /api from indexing
  not-found.tsx         — 404 page

components/
  layout/
    Nav.tsx
    Footer.tsx

lib/
  supabase.ts           — DB client and TypeScript types
  schema.sql            — Run this once in Supabase SQL editor
```
