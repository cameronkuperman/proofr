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
        // Proofr brand colors from the logo
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