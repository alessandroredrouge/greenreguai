// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensures Tailwind processes all your files
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#2E8B57',
        'deep-blue': '#1F3A93',
        'light-gray': '#F5F5F5',
        'bright-lime': '#A8E10C',
        'dark-charcoal': '#333333',
        'medium-gray': '#666666',
        'crimson-red': '#E74C3C',
      },
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


