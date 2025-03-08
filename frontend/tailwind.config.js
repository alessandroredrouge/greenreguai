// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "harvey-dark": "#0F1419",
        "harvey-sidebar": "#0F1419",
        "harvey-bg": "#F8F5F1",
        "harvey-bg-darker": "#F2EFE9",
        "harvey-bg-lighter": "#FDFCFA",
        "harvey-border": "#E8E4DD",
        "harvey-text": "#111827",
        "harvey-text-light": "#6B7280",
        "harvey-accent": "#111827",
        "harvey-hover": "#F0EDE7",
        "harvey-selected": "#E8E4DD",
      },
      fontFamily: {
        code: ["Fira Code", "monospace"],
        system: ["system-ui", "sans-serif"],
        harvey: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "eco-glow":
          "0 0 5px theme(colors.eco-green), 0 0 20px theme(colors.eco-green)",
      },
      keyframes: {
        "citation-pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      animation: {
        "citation-pulse": "citation-pulse 2s ease-in-out 1",
      },
    },
  },
  plugins: [],
};
