/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D63027',
          bg: '#FDF0EF',
        },
        success: {
          DEFAULT: '#1D7A4B',
          bg: '#E8F4ED',
        },
        warning: {
          DEFAULT: '#8B6914',
          bg: '#FFFAF0',
          border: '#F5DEB3',
        },
        link: '#185FA5',
        ink: {
          DEFAULT: '#1A1A1A',
          muted: '#444444',
          soft: '#666666',
          subtle: '#999999',
          tertiary: '#BBBBBB',
        },
        border: {
          DEFAULT: '#DDDDDD',
          soft: '#F0F0F0',
        },
        code: '#FAFAF8',
      },
      fontFamily: {
        display: ['"League Gothic"', 'sans-serif'],
        sans: ['Raleway', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', '"Fira Code"', 'monospace'],
      },
      maxWidth: {
        content: '780px',
      },
    },
  },
  plugins: [],
}
