/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./features/**/*.{js,jsx,ts,tsx}",
    "./provider/**/*.{js,jsx,ts,tsx}",
    "../../apps/next/app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Balanced Warm + Strong color scheme
        'proofr-bg': '#FFFAF6',         // warm cream background (keeping what you loved)
        'proofr-text': '#18181B',       // strong black for headlines (impact)
        'proofr-text-muted': '#6B7280', // warm grey for supporting text
        'proofr-accent': '#2563EB',     // warm blue for trust + energy
        'proofr-border': '#E5E7EB',     // subtle warm border
        
        // Primary actions - black with warm touches
        'proofr-primary': '#18181B',    // strong black for CTAs
        'proofr-primary-hover': '#374151', // warm black hover
        
        // Legacy colors (keeping for compatibility)
        'proofr-navy': '#1a1f3a',
        'proofr-cyan': '#00bcd4', 
        'proofr-coral': '#ff6b6b',
      },
      fontFamily: {
        // You can add custom fonts here
      },
    },
  },
  plugins: [],
}