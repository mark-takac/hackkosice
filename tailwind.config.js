/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        tatra: {
          /** Deep navy (closer to TB app dark mode than pure black) */
          background: '#061018',
          foreground: '#fafafa',
          muted: '#a1a1aa',
          'muted-foreground': '#71717a',
          card: '#0d1624',
          'card-foreground': '#fafafa',
          /** Slightly lifted panels */
          elevated: '#111f2e',
          border: '#1e2a3a',
          primary: '#009fe3',
          'primary-foreground': '#ffffff',
          secondary: '#27272a',
          'secondary-foreground': '#fafafa',
          success: '#16a34a',
          'success-foreground': '#ffffff',
          /** Bright CTA green (create event card) */
          cta: '#22c55e',
          'cta-foreground': '#ffffff',
          accent: '#d4af37',
          'accent-foreground': '#0a0a0a',
          destructive: '#ef4444',
          ring: '#009fe3',
        },
      },
    },
  },
  plugins: [],
};
