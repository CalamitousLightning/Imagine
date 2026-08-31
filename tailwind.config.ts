import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- PUBLIC WEBSITE: editorial / artistic / premium / bold ----
        // Backed by CSS variables (globals.css) instead of literal hex so the
        // light/dark mode toggle and accent switcher (violet/cyan/gold) work
        // by re-pointing these variables — no component ever needs to change
        // which class it uses.
        public: {
          ivory: "hsl(var(--pub-ivory) / <alpha-value>)",
          black: "hsl(var(--pub-black) / <alpha-value>)",
          white: "hsl(var(--pub-white) / <alpha-value>)",
          violet: "hsl(var(--pub-accent) / <alpha-value>)",
          coral: "hsl(var(--pub-coral) / <alpha-value>)",
          lime: "hsl(var(--pub-lime) / <alpha-value>)",
        },
        // ---- PRIVATE ADMIN: dark / technical / futuristic / creative ----
        admin: {
          bg: "hsl(var(--adm-bg) / <alpha-value>)",
          secondary: "hsl(var(--adm-secondary) / <alpha-value>)",
          panel: "hsl(var(--adm-panel) / <alpha-value>)",
          border: "hsl(var(--adm-border) / <alpha-value>)",
          text: "hsl(var(--adm-text) / <alpha-value>)",
          muted: "hsl(var(--adm-muted) / <alpha-value>)",
          green: "hsl(var(--adm-primary) / <alpha-value>)",
          violet: "hsl(var(--adm-violet) / <alpha-value>)",
          cyan: "hsl(var(--adm-cyan) / <alpha-value>)",
          amber: "hsl(var(--adm-amber) / <alpha-value>)",
          // Text color for content sitting on top of a bright admin-green/
          // primary-colored surface (buttons, badges) — always dark, on
          // purpose, regardless of light/dark mode or which accent is active.
          onPrimary: "hsl(var(--adm-on-primary) / <alpha-value>)",
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
