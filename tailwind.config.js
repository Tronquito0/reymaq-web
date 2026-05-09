/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#0B0B0D",
        carbon: "#111111",
        steel: "#6B7280",
        metal: "#2A2A2A",
        reyred: "#D71920",
        darkred: "#9B111E",
        warm: "#FAFAFA"
      },
      fontFamily: {
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        redglow: "0 20px 60px rgba(215, 25, 32, 0.18)",
        hard: "0 18px 40px rgba(0, 0, 0, 0.18)"
      }
    }
  },
  plugins: []
};
