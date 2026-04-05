/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        "dm-sans": ["var(--font-dm-sans)"],
        "dm-serif-display": ["var(--font-dm-serif-display)"],
        "geist-sans": ["var(--font-geist-sans)"],
        montserrat: ["var(--font-montserrat)"],
        "pt-serif": ["var(--font-pt-serif)"],
        roboto: ["var(--font-roboto)"],
        "roboto-condensed": ["var(--font-roboto-condensed)"],
        ultra: ["var(--font-ultra)"],
        inter: ["var(--font-inter)"],
        syne: ["var(--font-syne)"],
        "archivo-black": ["var(--font-archivo-black)"],
        "open-sans": ["var(--font-open-sans)"],
        lato: ["var(--font-lato)"],
        oswald: ["var(--font-oswald)"],
        raleway: ["var(--font-raleway)"],
        poppins: ["var(--font-poppins)"],
        "playfair-display": ["var(--font-playfair-display)"],
        nunito: ["var(--font-nunito)"],
        rubik: ["var(--font-rubik)"],
        "work-sans": ["var(--font-work-sans)"],
        lora: ["var(--font-lora)"],
        "bebas-neue": ["var(--font-bebas-neue)"],
        quicksand: ["var(--font-quicksand)"],
        "space-grotesk": ["var(--font-space-grotesk)"],
        "libre-baskerville": ["var(--font-libre-baskerville)"],
        "josefin-sans": ["var(--font-josefin-sans)"],
        cabin: ["var(--font-cabin)"],
        karla: ["var(--font-karla)"],
        bitter: ["var(--font-bitter)"],
        merriweather: ["var(--font-merriweather)"],
        "roboto-slab": ["var(--font-roboto-slab)"],
        barlow: ["var(--font-barlow)"],
        "nunito-sans": ["var(--font-nunito-sans)"],
        "fira-sans": ["var(--font-fira-sans)"],
        anton: ["var(--font-anton)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
