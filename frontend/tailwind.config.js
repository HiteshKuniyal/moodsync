/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(60, 5%, 96%)',
        foreground: 'hsl(60, 5%, 10%)',
        card: 'hsl(0, 0%, 100%)',
        'card-foreground': 'hsl(60, 5%, 10%)',
        primary: {
          DEFAULT: 'hsl(105, 23%, 33%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(30, 54%, 64%)',
          foreground: 'hsl(60, 5%, 10%)',
        },
        muted: {
          DEFAULT: 'hsl(60, 5%, 90%)',
          foreground: 'hsl(60, 5%, 40%)',
        },
        accent: {
          DEFAULT: 'hsl(13, 69%, 63%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        border: 'hsl(60, 5%, 85%)',
        input: 'hsl(60, 5%, 90%)',
        ring: 'hsl(105, 23%, 33%)',
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(74, 103, 65, 0.1)',
        'float': '0 10px 40px -10px rgba(74, 103, 65, 0.15)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}