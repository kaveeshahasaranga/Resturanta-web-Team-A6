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
        sans:      ['Inter', 'system-ui', 'sans-serif'],
        serif:     ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        cinzel:    ['Cinzel', 'serif'],
        playfair:  ['"Playfair Display"', 'serif'],
        mono:      ['JetBrains Mono', 'monospace'],
      },
      colors: {
        praneetha: {
          bg: '#0a0a0c',
          card: '#141416',
          cardHover: '#18181c',
          input: '#1a1a1e',
          inputBorder: '#27272b',
          inputFocus: '#ec6f00',
          orange: '#e66200',
          orangeHover: '#f97316',
          textMuted: '#8e8e93',
          textLight: '#e4e4e7',
        },
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
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #ec6f00 0%, #f97316 100%)',
        'gradient-dark':   'linear-gradient(180deg, #000000 0%, #111111 100%)',
        'luxury-radial':   'radial-gradient(ellipse 650px 450px at 50% 45%, rgba(234, 88, 12, 0.08) 0%, rgba(10, 10, 12, 0.95) 100%)',
      },
      boxShadow: {
        'orange-glow': '0 0 25px rgba(236, 111, 0, 0.45)',
        'orange-sm':   '0 0 10px rgba(236, 111, 0, 0.3)',
        'card-dark':   '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 25px rgba(234, 88, 12, 0.04)',
      },
      animation: {
        'fade-in':      'fadeIn 0.35s ease-out forwards',
        'slide-up':     'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down':   'slideDown 0.35s ease-out forwards',
        'scale-in':     'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':      'shimmer 2.5s infinite',
        'float-slow':   'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: 0 },                                        '100%': { opacity: 1 } },
        slideUp:   { '0%': { opacity: 0, transform: 'translateY(16px)' },         '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: 0, transform: 'translateY(-12px)' },        '100%': { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:   { '0%': { opacity: 0, transform: 'scale(0.96)' },             '100%': { opacity: 1, transform: 'scale(1)' } },
        shimmer:   { '0%': { transform: 'translateX(-100%)' },                    '100%': { transform: 'translateX(200%)' } },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
