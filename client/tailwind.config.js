/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        line: 'var(--line)',
        accent: {
          DEFAULT: 'var(--accent)',
          strong: 'var(--accent-strong)',
        },
        muted: 'var(--muted)',
        primary: {
          50: '#FAF7FF',
          100: '#F3EDFF',
          200: '#E4D5FF',
          300: '#D0BAFF',
          400: '#BBA4FF',
          500: '#A388EE',
          600: '#8B5CF6',
          700: '#7C3AED',
          800: '#6745BA',
          900: '#4F3294',
          950: '#171222',
        },
        charcoal: '#111114',
        'warm-white': '#F8F8FC',
      },
      borderRadius: {
        box: '10px',
        card: '10px',
        tag: '4px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
