/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/app/features/**/*.{js,jsx,ts,tsx}",
    "../../packages/app/components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - Emerald
        primary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Accent - Crimson
        accent: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Purple - Expert
        purple: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Teal - Fresh
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // Background colors
        background: {
          DEFAULT: '#FAFAF8',
          dark: '#000000',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0A0A0A',
          raised: {
            DEFAULT: '#FFFFFF',
            dark: '#141414',
          },
        },
        // University colors
        harvard: '#A51C30',
        yale: '#00356B',
        princeton: '#FF6900',
        stanford: '#8C1515',
        mit: '#A31F34',
        
        // Legacy Proofr brand colors (kept for compatibility)
        'proofr-navy': '#1a1f3a',
        'proofr-cyan': '#00bcd4', 
        'proofr-coral': '#ff6b6b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'glow-sm': '0 0 10px rgba(16, 185, 129, 0.3)',
        'glow-md': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(16, 185, 129, 0.1)',
      },
      animation: {
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-down': 'slide-down 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            opacity: 1,
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
          },
          '50%': {
            opacity: 0.8,
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)',
          },
        },
        'slide-up': {
          from: {
            transform: 'translateY(10px)',
            opacity: 0,
          },
          to: {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
        'slide-down': {
          from: {
            transform: 'translateY(-10px)',
            opacity: 0,
          },
          to: {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
        'scale-in': {
          from: {
            transform: 'scale(0.95)',
            opacity: 0,
          },
          to: {
            transform: 'scale(1)',
            opacity: 1,
          },
        },
        'fade-in': {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
        'gradient-accent': 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
        'gradient-premium': 'linear-gradient(135deg, #047857 0%, #DC2626 50%, #047857 100%)',
      },
    },
  },
  plugins: [],
}