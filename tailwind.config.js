/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        wealth: {
          primary: "hsl(var(--wealth-primary))",
          secondary: "hsl(var(--wealth-secondary))",
          tertiary: "hsl(var(--wealth-tertiary))",
          success: "hsl(var(--wealth-success))",
          warning: "hsl(var(--wealth-warning))",
          info: "hsl(var(--wealth-info))",
          error: "hsl(var(--wealth-error))",
        },
      },
      backgroundImage: {
        "gradient-wealth":
          "linear-gradient(135deg, hsl(var(--wealth-primary)) 0%, hsl(var(--wealth-secondary)) 100%)",
        "gradient-wealth-alt":
          "linear-gradient(135deg, hsl(var(--wealth-secondary)) 0%, hsl(var(--wealth-tertiary)) 100%)",
        "gradient-success":
          "linear-gradient(135deg, hsl(var(--wealth-success)) 0%, hsl(142 76% 45%) 100%)",
        "gradient-info":
          "linear-gradient(135deg, hsl(var(--wealth-info)) 0%, hsl(199 89% 60%) 100%)",
        "card-gradient":
          "linear-gradient(to right bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))",
        "wealth-gradient-soft":
          "linear-gradient(to bottom right, hsl(var(--wealth-neutral-50)), hsl(var(--wealth-neutral-100)))",
        "wealth-gradient-primary":
          "linear-gradient(135deg, hsl(var(--wealth-primary)) 0%, hsl(var(--wealth-primary-dark)) 100%)",
        "wealth-gradient-secondary":
          "linear-gradient(135deg, hsl(var(--wealth-secondary)) 0%, hsl(var(--wealth-secondary-dark)) 100%)",
        "wealth-gradient-success":
          "linear-gradient(135deg, hsl(var(--wealth-success)) 0%, hsl(var(--wealth-success-light)) 100%)",
        "wealth-card-highlight":
          "linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))",
      },
      boxShadow: {
        "wealth-sm":
          "0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05)",
        "wealth-md":
          "0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05)",
        "wealth-lg":
          "0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.05)",
        "wealth-xl":
          "0 20px 50px rgba(0, 0, 0, 0.1), 0 10px 24px rgba(0, 0, 0, 0.05)",
        "wealth-card":
          "0px 4px 16px rgba(17, 24, 39, 0.05), 0px 2px 4px rgba(17, 24, 39, 0.03)",
        "wealth-card-hover":
          "0px 8px 24px rgba(17, 24, 39, 0.08), 0px 4px 8px rgba(17, 24, 39, 0.05)",
        "wealth-stat":
          "0px 1px 3px rgba(17, 24, 39, 0.03), 0px 1px 2px rgba(17, 24, 39, 0.02)",
      },
      keyframes: {
        "wealth-pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "wealth-pulse": "wealth-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
