import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50:  '#FFF4F8',
          100: '#FCE8F0',
          200: '#F9D0E3',
          300: '#F4B0CC',
          400: '#E87FAD',
          500: '#D4547E',
          600: '#C85B80',
          700: '#A84468',
          800: '#8B2A52',
          900: '#6B1A3E',
        },
        cream: {
          50:  '#FAFAF8',
          100: '#F5F3EF',
          200: '#EDE8E0',
        },
        gold: '#C8A464',
      },
      fontFamily: {
        sans:  ['var(--font-dm-sans)',     'DM Sans',           'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)',   'Cormorant Garamond','Georgia',   'serif'],
      },
      animation: {
        'fade-up':     'fadeUp .65s ease both',
        'fade-in':     'fadeIn .5s ease both',
        'cart-bounce': 'cartBounce .45s ease',
        'toast-slide': 'toastSlide .3s ease',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        cartBounce: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.35)' },
          '70%':  { transform: 'scale(.9)' },
          '100%': { transform: 'scale(1)' },
        },
        toastSlide: {
          from: { opacity: '0', transform: 'translate(-50%,16px)' },
          to:   { opacity: '1', transform: 'translate(-50%,0)' },
        },
      },
      boxShadow: {
        'rose-sm': '0 4px 16px rgba(200,91,128,.15)',
        'rose-md': '0 8px 32px rgba(200,91,128,.20)',
        'rose-lg': '0 16px 56px rgba(200,91,128,.18)',
        'card':    '0 2px 16px rgba(0,0,0,.06)',
        'card-hover': '0 12px 48px rgba(0,0,0,.10)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}

export default config