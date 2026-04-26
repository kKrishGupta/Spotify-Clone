/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0B0B15",
        ink: "#11111D",
        panel: "#151521",
        muted: "#9CA3AF",
        beatPurple: "#7C3AED",
        beatPink: "#EC4899",
        beatViolet: "#A855F7",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(168, 85, 247, 0.35)",
        card: "0 24px 80px rgba(0, 0, 0, 0.32)",
        soft: "0 16px 40px rgba(0, 0, 0, 0.28)",
      },
      backgroundImage: {
        "beat-gradient": "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
        "beat-radial": "radial-gradient(circle at top left, rgba(236, 72, 153, 0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.2), transparent 35%)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(18px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 22px rgba(168, 85, 247, 0.22)" },
          "50%": { boxShadow: "0 0 42px rgba(236, 72, 153, 0.34)" },
        },
      },
      animation: {
        floatIn: "floatIn 520ms ease-out both",
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
