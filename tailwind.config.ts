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
        sudanGreen: '#10b981', // Changed to Emerald/Teal
        ink: '#111827',
        surface: '#171717',
        background: '#0a0a0a',
        primary: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 18px 50px rgba(0, 0, 0, 0.4)' },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-mesh': 'radial-gradient(at 0% 0%, hsla(160, 84%, 39%, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(160, 84%, 39%, 0.1) 0px, transparent 50%)',
      },
    }
  },
  plugins: []
};
export default config;
