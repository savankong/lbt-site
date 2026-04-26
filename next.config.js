/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about-lbt',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
