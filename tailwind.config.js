/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern:
        /^(?:!)?bg-category-(blue|green|orange|purple|pink|cyan)-bg$/,
    },
    {
      pattern:
        /^(?:!)?text-category-(blue|green|orange|purple|pink|cyan)-text$/,
    },
    {
      pattern:
        /^(?:!)?border-category-(blue|green|orange|purple|pink|cyan)-border$/,
    },
  ],
  theme: {
    extend: {
      colors: {
        category: {
          blue: {
            bg: "#E8F1FF",
            text: "#1E3A8A",
            border: "#C7DBFF",
          },
          green: {
            bg: "#EAFBF2",
            text: "#166534",
            border: "#C7F2D9",
          },
          orange: {
            bg: "#FFF4E6",
            text: "#9A3412",
            border: "#FFE0B7",
          },
          purple: {
            bg: "#F3E8FF",
            text: "#6B21A8",
            border: "#E2D0FF",
          },
          pink: {
            bg: "#FFEAF2",
            text: "#9D174D",
            border: "#FFD0E0",
          },
          cyan: {
            bg: "#E9FBFF",
            text: "#155E75",
            border: "#C5F3FF",
          },
        },
      },
      backgroundImage: {
        "admin-card":
          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        "landing-hero":
          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
        "landing-card-note":
          "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        "landing-card-folder":
          "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        "landing-card-search":
          "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      },
    },
  },
  plugins: [],
};
