/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary brand colors with dark theme variations
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        // Custom dark theme primary (based on #4B1B76)
        "dark-primary": {
          50: "#faf7ff",
          100: "#f3edff",
          200: "#e9deff",
          300: "#d4c2ff",
          400: "#b899ff",
          500: "#9c6eff",
          600: "#8b47ff",
          700: "#7b2ff7",
          800: "#6929d4",
          900: "#4B1B76", // Your specified dark color
          950: "#2d0f47",
        },
        // Accent colors for complementary elements
        accent: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },
        // Enhanced grays for better contrast
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        // Success, warning, and error states
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        // Glassmorphism background colors
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.2)",
          heavy: "rgba(255, 255, 255, 0.3)",
          "dark-light": "rgba(0, 0, 0, 0.1)",
          "dark-medium": "rgba(0, 0, 0, 0.2)",
          "dark-heavy": "rgba(0, 0, 0, 0.3)",
        },
      },
      // Enhanced typography
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }],
      },
      // Enhanced spacing system
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      // Custom border radius
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      // Enhanced shadows with glassmorphism effects
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-lg": "0 0 40px rgba(139, 92, 246, 0.4)",
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "soft-lg":
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 40px -10px rgba(0, 0, 0, 0.1)",
        dramatic: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      // Custom backdrop blur
      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
      },
      // Enhanced gradients
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)",
        "dark-glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgb(120, 119, 198) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(120, 119, 198) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(120, 119, 198) 0px, transparent 50%)",
      },
      // Custom animations
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "fade-in-down": "fadeInDown 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "scale-pulse": "scalePulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(-2px)" },
          "50%": { transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%": { boxShadow: "0 0 5px rgba(139, 92, 246, 0.4)" },
          "100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        scalePulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      // Custom transitions
      transitionDuration: {
        400: "400ms",
        600: "600ms",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // Custom z-index values
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      // Scrollbar styling
      scrollbar: {
        thin: {
          "scrollbar-width": "thin",
        },
      },
    },
  },
  plugins: [
    // Custom plugin for glassmorphism utilities
    function ({ addUtilities, theme, e }) {
      const glassUtilities = {
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".glass-heavy": {
          background: "rgba(255, 255, 255, 0.2)",
          "backdrop-filter": "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
        ".glass-heavy-dark": {
          background: "rgba(0, 0, 0, 0.2)",
          "backdrop-filter": "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      };

      addUtilities(glassUtilities, ["responsive", "hover"]);
    },

    // Custom plugin for scrollbar styling
    function ({ addUtilities, theme }) {
      const scrollbarUtilities = {
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
        },
        ".scrollbar-thumb-primary-200": {
          "scrollbar-color": theme("colors.primary.200") + " transparent",
        },
        ".scrollbar-thumb-gray-600": {
          "scrollbar-color": theme("colors.gray.600") + " transparent",
        },
        // Webkit scrollbar styles
        ".scrollbar-thin::-webkit-scrollbar": {
          width: "4px",
        },
        ".scrollbar-thin::-webkit-scrollbar-track": {
          background: "transparent",
        },
        ".scrollbar-thin::-webkit-scrollbar-thumb": {
          "background-color": theme("colors.gray.300"),
          "border-radius": "2px",
        },
        ".dark .scrollbar-thin::-webkit-scrollbar-thumb": {
          "background-color": theme("colors.gray.600"),
        },
        ".scrollbar-thin::-webkit-scrollbar-thumb:hover": {
          "background-color": theme("colors.gray.400"),
        },
        ".dark .scrollbar-thin::-webkit-scrollbar-thumb:hover": {
          "background-color": theme("colors.gray.500"),
        },
      };

      addUtilities(scrollbarUtilities);
    },

    // Custom plugin for gradient text utilities
    function ({ addUtilities, theme }) {
      const gradientTextUtilities = {
        ".text-gradient": {
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-image": `linear-gradient(135deg, ${theme(
            "colors.primary.600"
          )}, ${theme("colors.accent.600")})`,
        },
        ".text-gradient-dark": {
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-image": `linear-gradient(135deg, ${theme(
            "colors.primary.400"
          )}, ${theme("colors.accent.400")})`,
        },
      };

      addUtilities(gradientTextUtilities, ["responsive", "hover"]);
    },
  ],
};
