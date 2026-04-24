/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // ─── CORRECÇÃO PRINCIPAL: activar modo escuro via classe ─────────────────
  // Sem isto, NENHUMA classe dark: funciona
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // Cores Angola oficiais
        angola: {
          red:    '#CC092F',
          yellow: '#FFCC00',
          black:  '#000000',
        },
        'angola-red':    '#CC092F',
        'angola-yellow': '#FFCC00',
        'angola-black':  '#000000',

        // Paleta primária — azul naval institucional
        primary: {
          50:  '#f0f5fa',
          100: '#dbe4ef',
          200: '#bfc9dc',
          300: '#94a5c4',
          400: '#627d9e',
          500: '#3b5a7e',
          600: '#2c4a6e',
          700: '#233b5a',
          800: '#1a2744',   // cor base da sidebar/header
          900: '#152238',
          950: '#0c1525',
        },

        // Cinzentos
        gray: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },

        // Estados
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },

      borderRadius: {
        'sm':  '0.125rem',
        'md':  '0.375rem',
        'lg':  '0.5rem',
        'xl':  '0.75rem',
        '2xl': '1rem',
      },

      boxShadow: {
        'soft':      '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'card':      '0 0 0 1px rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.1)',
        'formal':    '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
        'formal-md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      },

      backgroundImage: {
        'angola-stripe': 'linear-gradient(90deg, #CC092F 33.33%, #111 33.33%, #111 66.66%, #FFCC00 66.66%)',
      },

      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.35s ease-out forwards',
      },

      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInUp:  { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
