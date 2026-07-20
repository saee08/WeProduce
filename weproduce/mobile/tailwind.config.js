/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0F1A",
        surface: "#141A29",
        surfaceAlt: "#1C2438",
        border: "#242C42",
        primary: "#6C5CE7",
        primaryAlt: "#8B7CF6",
        accent: "#00D9A3",
        gold: "#FFC145",
        silver: "#C0C7D6",
        bronze: "#D98E4A",
        textPrimary: "#F5F6FA",
        textSecondary: "#9AA3B8",
        danger: "#FF5C6C",
      },
      borderRadius: {
        xl2: "20px",
      },
    },
  },
  plugins: [],
};
