import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        'gold-light': '#E8C97A',
        ink: '#0A0806',
        'ink-2': '#111009',
        'ink-3': '#181410',
        paper: '#F0EAD8',
        'paper-2': '#EDE4CE',
        stone: '#7A746A',
        'stone-2': '#9A9088',
        cream: '#FAF6EE',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
