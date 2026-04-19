/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores da bandeira angolana - cores oficiais
        angola: {
          red: '#CC092F',
          yellow: '#FFCC00',
          black: '#000000',
        },
        // Paleta institucional minimalista
        institucional: {
          base: '#FFFFFF',    // Branco - fundo
          estrutura: '#1F1F1F', // Preto/Cinza escuro - menus, textos
          destaque: '#C9A227', // Dourado - botões principais, ícones
          alerta: '#8B0000',    // Vermelho escuro - erros, avisos
          cinza: '#2C2C2C',
          cinzaClaro: '#F5F5F5',
        },
        // Cores com dash para uso em classes Tailwind
        'angola-red': '#CC092F',
        'angola-yellow': '#FFCC00',
        'angola-black': '#000000',
        // Cores institucionais simples
        'institucional-base': '#FFFFFF',
        'institucional-estrutura': '#1F1F1F',
        'institucional-destaque': '#C9A227',
        'institucional-alerta': '#8B0000',
        'institucional-cinza': '#2C2C2C',
        'institucional-cinza-claro': '#F5F5F5',
        // Tema Angola - gradiente oficial (preto, vermelho, amarelo)
        theme: {
          50: '#faf5eb',
          100: '#f5ebd6',
          200: '#ebd7ad',
          300: '#e0c17a',
          400: '#d4a847',
          500: '#c99c29',
          600: '#b88a1f',
          700: '#9a6f19',
          800: '#7c5615',
          900: '#5e4211',
          950: '#3d2a0c',
          primary: '#CC092F',
          secondary: '#FFCC00',
          dark: '#1a1a1a',
        },
        // Cores institucionais - mais sóbrias e profissionais
        // Azul escuro institucional (formal,权威)
        institucional: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        // Cores primárias - azul marinho formal
        primary: {
          50: '#f0f5fa',
          100: '#dbe4ef',
          200: '#bfc9dc',
          300: '#94a5c4',
          400: '#627d9e',
          500: '#3b5a7e',
          600: '#2c4a6e',
          700: '#233b5a',
          800: '#1c2e48',
          900: '#152238',
          950: '#0c1525',
        },
        // Cores secundárias - cinza azulado
        secondary: {
          50: '#f5f5f5',
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#808080',
          500: '#666666',
          600: '#4d4d4d',
          700: '#333333',
          800: '#1a1a1a',
          900: '#0d0d0d',
        },
        // Cores de estado - tons mais sóbrios
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Cinzentos formais para textos e backgrounds
        gray: {
          50: '#f9fafb',
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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'angola': '0 4px 14px -3px rgba(204, 9, 47, 0.25), 0 2px 6px -2px rgba(255, 204, 0, 0.15)',
        'angola-lg': '0 10px 25px -5px rgba(204, 9, 47, 0.3), 0 8px 10px -6px rgba(255, 204, 0, 0.2)',
        'formal': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'formal-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'formal-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        // Gradientes formais para backgrounds
        'institucional-gradient': 'linear-gradient(180deg, #102a43 0%, #1c2e48 100%)',
        'institucional-light': 'linear-gradient(180deg, #f0f4f8 0%, #d9e2ec 100%)',
        // Gradientes Angola - Tema oficial (preto, vermelho, amarelo)
        'angola-gradient': 'linear-gradient(135deg, #CC092F 0%, #FFCC00 50%, #000000 100%)',
        'angola-gradient-horizontal': 'linear-gradient(90deg, #CC092F 0%, #FFCC00 50%, #000000 100%)',
        'angola-gradient-vertical': 'linear-gradient(180deg, #CC092F 0%, #FFCC00 50%, #000000 100%)',
        'angola-gradient-subtle': 'linear-gradient(135deg, rgba(204, 9, 47, 0.1) 0%, rgba(255, 204, 0, 0.1) 50%, rgba(0, 0, 0, 0.05) 100%)',
        'angola-red-yellow': 'linear-gradient(135deg, #CC092F 0%, #FFCC00 100%)',
        'angola-accent': 'linear-gradient(90deg, #CC092F 0%, #e01235 50%, #FFCC00 100%)',
        // Tema Angola - mais subtil para uso geral
        'theme-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #CC092F 50%, #FFCC00 100%)',
        'theme-gradient-light': 'linear-gradient(135deg, #3d2a0c 0%, #CC092F 50%, #c99c29 100%)',
        'theme-gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #991b1b 50%, #b88a1f 100%)',
        'theme-sidebar': 'linear-gradient(180deg, #1a1a1a 0%, #2d1515 50%, #1a1a1a 100%)',
        'theme-header': 'linear-gradient(90deg, #1a1a1a 0%, #2d1515 50%, #1a1a1a 100%)',
        'formal-gradient': 'linear-gradient(180deg, #1c2e48 0%, #243b53 50%, #334e68 100%)',
        // Padrão sutil para backgrounds
        'formal-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
