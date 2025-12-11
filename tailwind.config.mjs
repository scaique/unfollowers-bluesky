/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    colors: {
      'primario': '#002244',
      'primario-escuro': '#00162e',
      'secundario': '#e5e5e5',
      'secundario-escuro': '#d1d1d1',
      'vermelho-c': '#c53030',
      'vermelho-b': '#b22222 ',
      // 'secundario': '#AAB7C4',
    }
  },
  plugins: [],
};
