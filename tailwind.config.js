module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "k8s-dark": "#101829",
        "k8s-primary": "#145dfb",
        "k8s-secondary": "#1e293b",
        "k8s-accent": "#3b82f6",
        "k8s-text": "#e2e8f0",
        "k8s-muted": "#64748b",
      },
    },
  },
  plugins: [],
};
