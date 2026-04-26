/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        ink: {
          DEFAULT: '#1a1714',
          soft: '#2e2b27',
          muted: '#6b6660',
          faint: '#a8a39d',
        },
        paper: {
          DEFAULT: '#f5f0e8',
          warm: '#ede7d9',
          cool: '#faf8f5',
        },
        amber: {
          lbt: '#c8892a',
          light: '#f0c96a',
          dim: '#8a5e18',
        },
        rust: '#a84832',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        wide: '0.08em',
        wider: '0.14em',
      },
    },
  },
  plugins: [],
}
