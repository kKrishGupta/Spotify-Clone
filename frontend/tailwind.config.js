/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        night: "#070711",
        ink: "#0d0d18",
        panel: "#151521",
        pulse: "#00e5ff",
        volt: "#b8ff5c",
        aurora: "#ff4ecd",
        plasma: "#8b5cf6",
        ember: "#ff7a45",
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 35px rgba(0, 229, 255, 0.28), 0 0 55px rgba(255, 78, 205, 0.18)",
        card: "0 24px 80px rgba(0, 0, 0, 0.38)",
        soft: "0 16px 40px rgba(0, 0, 0, 0.30)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
      backgroundImage: {
        "aurora-grid":
          "radial-gradient(circle at 15% 20%, rgba(0, 229, 255, 0.18), transparent 28%), radial-gradient(circle at 78% 5%, rgba(255, 78, 205, 0.16), transparent 26%), radial-gradient(circle at 70% 85%, rgba(184, 255, 92, 0.12), transparent 24%), linear-gradient(135deg, #070711 0%, #10101f 48%, #0b1020 100%)",
        "premium-line":
          "linear-gradient(90deg, rgba(0,229,255,.95), rgba(255,78,205,.88), rgba(184,255,92,.92))",
        "glass-sheen":
          "linear-gradient(145deg, rgba(255,255,255,.14), rgba(255,255,255,.035))",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(18px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 22px rgba(0, 229, 255, 0.20)" },
          "50%": { boxShadow: "0 0 46px rgba(255, 78, 205, 0.28)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        waveform: {
          "0%, 100%": { transform: "scaleY(.35)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        floatIn: "floatIn 520ms ease-out both",
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        waveform: "waveform 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
