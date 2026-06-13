import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#f6efe7',
        nile: '#2563eb',
        sudanRed: '#dc2626',
        sudanGreen: '#16a34a',
        ink: '#111827'
      },
      boxShadow: { soft: '0 18px 50px rgba(15, 23, 42, 0.08)' }
    }
  },
  plugins: []
};
export default config;
