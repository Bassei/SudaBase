import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary
        brandBlue: '#0057FF',
        primary: '#0057FF', // Alias for brandBlue
        // Secondary
        brandGreen: '#00C896',
        secondary: '#00C896', // Alias for brandGreen
        // Backgrounds
        darkNavy: '#0A192F',
        pureWhite: '#FFFFFF',
        lightSurface: '#F5F7FA',
        background: '#0a0a0a', // keep generic for some dark mode defaults
        // Alerts
        alertWarning: '#FFB800',
        alertError: '#FF3B30',
        alertInfo: '#00A3FF',
        // Neutral
        neutralData: '#8A94A6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
      boxShadow: { 
        soft: '0 8px 24px rgba(0, 0, 0, 0.12)',
        card: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-mesh': 'radial-gradient(at 0% 0%, hsla(219, 100%, 50%, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(160, 100%, 39%, 0.1) 0px, transparent 50%)',
      },
    }
  },
  plugins: []
};
export default config;
