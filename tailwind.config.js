/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nocturn: 'var(--color-nocturn)',
        brand: {
          50: 'var(--color-brand-50)',
          500: 'var(--color-brand-500)', 
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          gray: 'var(--color-brand-gray)',
          'gray-hover': 'var(--color-brand-gray-hover)',
        },
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      fontFamily: {
        sans: ['Source Sans Pro', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
