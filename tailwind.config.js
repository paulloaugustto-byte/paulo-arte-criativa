/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand azul — used as accent only, never large dark backgrounds
        brand: {
          50: '#eef3f8',
          100: '#d9e4f0',
          200: '#b3c8e0',
          300: '#7da0c8',
          400: '#4a74a8',
          500: '#2a5380',
          600: '#1e4166',
          700: '#163350',
          800: '#10263c',
          900: '#0a1a2c',
        },
        // Rosé Gold
        rose: {
          50: '#fdf5f4',
          100: '#f9e8e6',
          200: '#f0d0cc',
          300: '#e4b0a9',
          400: '#d2897f',
          500: '#c06a5e',
          600: '#a85547',
          700: '#8a4439',
          800: '#6d362e',
          900: '#4f2822',
        },
        // Nude / Beige
        nude: {
          50: '#fdfbf9',
          100: '#faf6f1',
          200: '#f5efe7',
          300: '#ece0d4',
          400: '#ddc9b8',
          500: '#c9ad97',
          600: '#b08e75',
          700: '#8e6f59',
          800: '#6e5644',
          900: '#4d3c30',
        },
        // Warm neutrals
        cream: {
          50: '#ffffff',
          100: '#fdfcfa',
          200: '#faf8f5',
          300: '#f5f2ee',
          400: '#eae5df',
          500: '#d8d1c7',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Poppins"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(180, 140, 110, 0.12)',
        'soft-lg': '0 12px 40px -12px rgba(180, 140, 110, 0.18)',
        'soft-xl': '0 20px 60px -16px rgba(180, 140, 110, 0.22)',
        glow: '0 0 30px -6px rgba(192, 106, 94, 0.3)',
        card: '0 2px 16px -6px rgba(180, 140, 110, 0.1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
