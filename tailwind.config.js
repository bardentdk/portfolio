/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#050E0A',
          secondary: '#080F0B',
          card:      '#0C1A13',
          glass:     'rgba(8,20,14,0.65)',
        },
        accent: {
          emerald: '#00E5A0',
          deep:    '#00C280',
          glow:    'rgba(0,229,160,0.18)',
        },
        neutral: {
          50:  '#EEF5F1',
          100: '#C8DDD4',
          400: '#6B9980',
          600: '#2E4A3A',
          700: '#1A2E23',
          800: '#0F1F17',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body:    ['"Poppins"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 40px rgba(0,229,160,0.28), 0 0 80px rgba(0,229,160,0.08)',
        'card':         '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover':   '0 8px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(0,229,160,0.08)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'spin-slow':  'spin 20s linear infinite',
        'marquee':    'marquee 25s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      transitionTimingFunction: {
        expo:   'cubic-bezier(0.19,1,0.22,1)',
        spring: 'cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
};