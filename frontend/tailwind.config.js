/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(200, 20%, 96%)',
        foreground: 'hsl(200, 10%, 15%)',
        card: 'hsl(0, 0%, 100%)',
        'card-foreground': 'hsl(200, 10%, 15%)',
        primary: {
          DEFAULT: 'hsl(180, 35%, 45%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(25, 75%, 60%)',
          foreground: 'hsl(200, 10%, 15%)',
        },
        muted: {
          DEFAULT: 'hsl(200, 20%, 90%)',
          foreground: 'hsl(200, 10%, 40%)',
        },
        accent: {
          DEFAULT: 'hsl(280, 45%, 65%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        border: 'hsl(200, 15%, 85%)',
        input: 'hsl(200, 20%, 92%)',
        ring: 'hsl(180, 35%, 45%)',
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'float': '0 10px 40px -10px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}