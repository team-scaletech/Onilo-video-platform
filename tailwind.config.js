/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        obsidian: '#06080D',
        stripeSlate: '#0F172A',
        netflixDark: '#0B0F17',
        cyanGlow: '#00f2fe',
        purpleGlow: '#7928ca',
        emeraldGlow: '#10b981',
        amberGlow: '#f59e0b',
        roseGlow: '#f43f5e',
        darkBg: '#090D16',
        darkCard: '#111827',
        darkBorder: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        cyanGlow: '0 0 25px -5px rgba(0, 242, 254, 0.4)',
        emeraldGlow: '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        roseGlow: '0 0 25px -5px rgba(244, 63, 94, 0.4)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        elevated: '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        heavy: '24px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-bounce': 'glowBounce 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite linear',
        'accordion-down': 'accordionDown 0.2s ease-out',
        'accordion-up': 'accordionUp 0.2s ease-out',
      },
      keyframes: {
        glowBounce: {
          '0%, 100%': { transform: 'translateY(-2%)', filter: 'brightness(1)' },
          '50%': { transform: 'translateY(2%)', filter: 'brightness(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        accordionDown: {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        accordionUp: {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
