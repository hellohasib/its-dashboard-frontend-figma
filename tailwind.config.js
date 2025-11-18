import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3758F9',
          text: '#637381',
        },
        dark: {
          DEFAULT: '#111928',
          dark3: '#374151',
        },
        gray: {
          DEFAULT: '#F9FAFB',
          gray2: '#F3F4F6',
        },
        status: {
          green: {
            bg: '#E9FFEF',
            text: '#409261',
          },
          orange: {
            bg: '#FFF2DD',
            text: '#D98634',
          },
          grey: {
            bg: '#E4E4E4',
            text: '#666970',
          },
          red: {
            bg: '#FFE9E6',
            text: '#FF746A',
          },
        },
        stroke: '#DFE4EA',
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(166, 175, 195, 0.4)',
        lg: '0 10px 15px -3px rgba(166, 175, 195, 0.1), 0 4px 6px -2px rgba(166, 175, 195, 0.05)',
      },
    },
  },
  plugins: [],
}

