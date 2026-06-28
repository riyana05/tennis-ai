/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clay: {
          50: "#FBF3EC",
          100: "#F4DFCB",
          300: "#E0A56F",
          500: "#C76B3C",   // primary clay-court terracotta
          700: "#9A4A26",
          900: "#5C2C16"
        },
        ace: {
          400: "#9FE870",
          500: "#7ED957",   // tennis ball / grass green accent
          600: "#5BBE3A"
        },
        chalk: "#F7F4ED",
        ink: "#23201D"
      },
      fontFamily: {
        display: ["'Oswald'", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"]
      },
      backgroundImage: {
        "court-lines": "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(247,244,237,0.08) 39px, rgba(247,244,237,0.08) 40px)"
      }
    }
  },
  plugins: []
};
