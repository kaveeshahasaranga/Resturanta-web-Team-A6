/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── FUCHSIUS Brand Palette ─────────────────────────────
        fuchsiusBlack:  '#000000',
        fuchsiusOrange: '#ec6f00',
        fuchsiusWhite:  '#ffffff',

        // ─── Derived shades for flexibility ─────────────────────
        orange: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6000',  // close to brand orange
          700: '#ec6f00',  // === fuchsiusOrange
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #ec6f00 0%, #f97316 100%)',
        'gradient-dark':   'linear-gradient(180deg, #000000 0%, #111111 100%)',
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(236, 111, 0, 0.4)',
        'orange-sm':   '0 0 8px  rgba(236, 111, 0, 0.25)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 },                           '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
