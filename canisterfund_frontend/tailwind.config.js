/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'ic-blue': '#29abe2',
          'ic-dark': '#1a1a1a',
        },
      },
    },
    plugins: [],
  }