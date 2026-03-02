/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#a855f7',
        'neon-blue': '#3b82f6',
        'neon-pink': '#ec4899',
        'neon-cyan': '#06b6d4',
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
      },
      animation: {
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'drop': 'drop 0.5s ease-out',
        'beam': 'beam 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor' },
        },
        'drop': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '60%': { transform: 'translateY(10%)', opacity: '1' },
          '80%': { transform: 'translateY(-5%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'beam': {
          '0%': { opacity: '0', height: '0%' },
          '100%': { opacity: '1', height: '100%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}
