import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- PUBLIC WEBSITE: editorial / artistic / premium / bold ----
        public: {
          ivory: "#F5F1E8",
          black: "#111111",
          white: "#FFFFFF",
          violet: "#7C3AED",
          coral: "#FF5A36",
          lime: "#C7F36B",
        },
        // ---- PRIVATE ADMIN: dark / technical / futuristic / creative ----
        admin: {
          bg: "#070A0D",
          secondary: "#0D1117",
          panel: "#111820",
          border: "#1E2A32",
          text: "#F5F7F9",
          muted: "#8B949E",
          green: "#39FF88",
          violet: "#8B5CF6",
          cyan: "#22D3EE",
          amber: "#F5B942",
        },
        // ---- shadcn-style semantic tokens ----
        // Driven by CSS variables (see globals.css) so the SAME primitives
        // (Button, Card, Input...) work in both the public site and the
        // admin control room and pick up the right palette automatically,
        // depending on whether they render inside .theme-public or .theme-admin.
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      fontFamily: {
        // Public: editorial display + clean body. Loaded via next/font in layout.
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        // Admin: technical monospace utility face.
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-up": "slide-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
