// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "eco-dark": "#0A2F2F",
        "eco-darker": "#0D1F1F",
        "eco-black": "#081616",
        "eco-green": "#00CF91",
        "eco-blue": "#00B4D8",
        "eco-yellow": "#FFD60A",
        "eco-leaf": "#4CAF50",
        "matrix-green": "#00FF41",
        "eco-gray": "#7A8F8F",
        "eco-text": "#E0F2F1",
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
