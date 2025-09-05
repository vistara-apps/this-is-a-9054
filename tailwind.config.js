/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 10%, 95%)',
        accent: 'hsl(45, 90%, 50%)',
        primary: 'hsl(210, 90%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        'purple-900': '#4c1d95',
        'purple-800': '#5b21b6',
        'purple-700': '#6d28d9',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 50%, 15%, 0.08)',
        'overlay': '0 12px 32px hsla(210, 50%, 15%, 0.16)',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
    },
  },
  plugins: [],
}