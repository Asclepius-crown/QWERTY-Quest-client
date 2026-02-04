/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          glow: 'rgb(var(--color-primary-glow) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        },
        base: {
          dark: 'rgb(var(--color-base-dark) / <alpha-value>)',
          navy: 'rgb(var(--color-base-navy) / <alpha-value>)',
          card: 'rgb(var(--color-base-navy) / 0.6)',
          content: 'rgb(var(--color-base-content) / <alpha-value>)',
          muted: 'rgb(var(--color-base-muted) / <alpha-value>)',
        },
        accent: {
          purple: '#A855F7', // Electric Purple
          cyan: '#06b6d4',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
