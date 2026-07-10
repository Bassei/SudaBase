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
          DEFAULT: '#1f8a4c',
          foreground: '#ffffff',
        },
        background: '#fbfdf8',
      }
    }
  },
  plugins: []
};
export default config;
