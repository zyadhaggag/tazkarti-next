import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0072ff", // Deep Electric Blue
        secondary: "#00c6ff", // Bright Cyan
        dark: "#030712",    // Very deep gray/black
        "card-bg": "rgba(3, 7, 18, 0.6)",
        "sky-blue": "#0ea5e9",
        success: "#10b981",
        error: "#f43f5e",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "primary-gradient": "linear-gradient(135deg, #0072ff, #00c6ff)",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-cyan": "pulseCyan 2s infinite",
        "blob": "blob 10s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseCyan: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -60px) scale(1.2)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.8)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        }
      },
    },
  },
  plugins: [],
};
export default config;
