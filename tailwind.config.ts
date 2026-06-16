import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-tajawal)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0ea5e9', // Tailwind sky-500
          foreground: '#ffffff',
        },
        background: '#020617', // slate-950
      }
    }
  },
  plugins: []
};
export default config;
