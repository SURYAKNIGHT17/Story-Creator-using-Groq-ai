/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00e5ff',
          purple: '#9a5cff'
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 229, 255, 0.4)',
        glowPurple: '0 0 20px rgba(154, 92, 255, 0.4)'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
