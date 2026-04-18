/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        tatra: {
          background: '#050608',
          foreground: '#fafafa',
          muted: '#a1a1aa',
          'muted-foreground': '#71717a',
          card: '#111113',
          'card-foreground': '#fafafa',
          border: '#27272a',
          primary: '#009fe3',
          'primary-foreground': '#ffffff',
          secondary: '#27272a',
          'secondary-foreground': '#fafafa',
          success: '#16a34a',
          'success-foreground': '#ffffff',
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
