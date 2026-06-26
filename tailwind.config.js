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
        primary: "#0f766e",
        "primary-foreground": "#ffffff",
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
