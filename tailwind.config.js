/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFDFC',
          100: '#FBFBF9',
          200: '#F5F4EE',
          300: '#EBE8DE',
          400: '#DDD8CB',
          500: '#C8C2B3',
        },
        ink: {
          900: '#141413',
          800: '#232220',
          700: '#3A3835',
          600: '#5A5752',
          500: '#7D7972',
          400: '#A49F96',
        },
        terracotta: {
          DEFAULT: '#C2410C',
          dark: '#9A3412',
          light: '#FFF7ED',
          border: '#FDBA74',
        },
        graphite: {
          DEFAULT: '#3F3F46',
          light: '#71717A',
          border: '#E4E4E7',
        },
        lab: {
          accent: '#0369A1', // functional technical blue
          success: '#15803D', // verified green
          warning: '#B45309', // attention amber
          danger: '#B91C1C', // failure/break red
        }
      },
      fontFamily: {
        serif: ['Charter', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        handwriting: ['Kalam', 'Caveat', 'cursive'],
      },
      boxShadow: {
        'notebook': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'elevated': '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
