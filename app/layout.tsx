import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lifebetweentitles.com'),
  title: {
    default: 'Life Between Titles — Career Transition Stories',
    template: '%s | Life Between Titles',
  },
  description: 'Honest conversations about career transition, professional identity, and what happens in the space between who you were and who you\'re becoming.',
  openGraph: {
    siteName: 'Life Between Titles',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lifebetweentitles',
  },
  alternates: {
    canonical: 'https://www.lifebetweentitles.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
