/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F172A',
          50: '#EEF1F6',
          100: '#DCE2EC',
          400: '#3B4A66',
          700: '#16213D',
          900: '#0F172A'
        },
        amber: {
          DEFAULT: '#D97706',
          50: '#FEF3E2',
          100: '#FCE4C0',
          400: '#E88A1F',
          600: '#D97706',
          700: '#B45F04'
        },
        paper: '#FBFAF7'
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Manrope"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 8px rgba(15, 23, 42, 0.06)'
      }
    }
  },
  plugins: []
}
