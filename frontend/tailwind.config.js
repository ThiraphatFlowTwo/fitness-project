/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#0F172A',
          950: '#0a1629',
        },
        steel: {
          50:  '#F5F7FA',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0d1117',
        },
        sky: {
          50:  '#e0f2fe',
          100: '#bae6fd',
          200: '#7dd3fc',
          300: '#38bdf8',
          400: '#0ea5e9',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #486581 0%, #0ea5e9 100%)',
        'gradient-dark':    'linear-gradient(135deg, #102a43 0%, #0369a1 100%)',
        'gradient-light':   'linear-gradient(135deg, #f0f4f8 0%, #e9ecef 100%)',
        'gradient-card':    'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #102a43 0%, #0d1117 100%)',
      },
      boxShadow: {
        'card':       '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'glow':       '0 0 20px rgba(14, 165, 233, 0.3)',
        'navy':       '0 4px 6px -1px rgba(15, 23, 42, 0.2)',
        'navy-lg':    '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '50%':      { boxShadow: '0 0 30px rgba(14, 165, 233, 0.6)' },
        },
      },
    },
  },
  safelist: [
    {
      pattern: /(bg|text|border)-(blue|green|yellow|purple|orange|red|navy|steel|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  plugins: [],
}