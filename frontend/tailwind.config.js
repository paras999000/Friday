/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        firday: {
          bg: '#08090D',
          surface: '#0E1117',
          card: '#141822',
          cardHover: '#1B202E',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(0, 240, 255, 0.3)',
          cyan: '#00F0FF',
          cyanDim: 'rgba(0, 240, 255, 0.12)',
          blue: '#38BDF8',
          violet: '#8B5CF6',
          violetDim: 'rgba(139, 92, 246, 0.15)',
          text: '#F1F5F9',
          muted: '#94A3B8',
          dim: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -5px rgba(0, 240, 255, 0.3)',
        'violet-glow': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
