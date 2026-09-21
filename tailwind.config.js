/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        card: {
          DEFAULT: 'var(--bg-card)',
          hover: 'var(--bg-card-hover)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          hairline: 'var(--border-hairline)',
        },
        ink: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        lime: {
          DEFAULT: 'var(--accent-lime)',
          hover: 'var(--accent-lime-hover)',
        },
        forest: {
          DEFAULT: 'var(--accent-forest)',
          light: 'var(--accent-forest-light)',
        },
        greendot: 'var(--accent-green-dot)',
        whatsapp: 'var(--whatsapp-green)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      transitionDuration: {
        micro: 'var(--duration-micro)',
        quick: 'var(--duration-quick)',
        fast: 'var(--duration-fast)',
        medium: 'var(--duration-medium)',
      },
      transitionTimingFunction: {
        'smooth-out': 'var(--ease-smooth-out)',
        'bounce': 'var(--ease-bounce)',
      },
      scale: {
        press: 'var(--scale-press)',
      },
      maxWidth: {
        'mobile-frame': '420px',
      },
      boxShadow: {
        'ios-card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'ios-float': '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
