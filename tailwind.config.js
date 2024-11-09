// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0D1117',
        'cyber-darker': '#161B22',
        'cyber-dark': '#21262D',
        'cyber-green': '#39D353',
        'cyber-blue': '#58A6FF',
        'cyber-purple': '#8957E5',
        'cyber-pink': '#FF3366',
        'cyber-gray': '#8B949E',
        'cyber-text': '#C9D1D9',
      },
      fontFamily: {
        'code': ['Fira Code', 'monospace'],
        'system': ['system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.cyber-green), 0 0 20px theme(colors.cyber-green.500)',
      },
    },
  },
  plugins: [],
}


