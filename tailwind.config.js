module.exports = {
  content: [
    "./*.html",
    "./*.md",
    "./_includes/**/*.html",
    "./blog/**/*.md",
    "./rutas/**/*.md",
    "./javascript/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#171717",
        muted: "#f4f4f5",
        "muted-foreground": "#71717a",
        border: "#e4e4e7",
        // Verde bosque = color de marca (naturaleza / Andes)
        primary: "#15803d",
        "primary-foreground": "#ffffff",
        // Ámbar tierra = acento para llamadas a la acción (CTA)
        accent: "#b45309",
        "accent-foreground": "#ffffff",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};
