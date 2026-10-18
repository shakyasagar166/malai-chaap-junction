/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0a0908',
          900: '#14120e',
          850: '#1a1713',
          800: '#231f1a',
          700: '#322c24',
          600: '#463e34'
        },
        tandoor: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          glow: '#ff5400'
        },
        malai: {
          50: '#fffdf5',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04'
        },
        pureveg: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif']
      },
      boxShadow: {
        'glow-tandoor': '0 0 25px -5px rgba(249, 115, 22, 0.35)',
        'glow-malai': '0 0 25px -5px rgba(250, 204, 21, 0.25)',
        'card-warm': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(249, 115, 22, 0.15)'
      }
    },
  },
  plugins: [],
}
