import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        electric: {
          950: "#0a0520", // Fondo Página (Casi negro)
          900: "#150a40", // Fondo Tarjetas
          800: "#200f60", // Bordes
          700: "#3318e8", // .color1
          600: "#502dee", // .color2
          500: "#6c43f4", // .color3
          400: "#8958f9", // .color4
          300: "#a56dff", // .color5 (Texto brillante)
          200: "#c499ff", // Hover
          100: "#e0caff", // Brillo máximo
        },
      },
    },
  },
  plugins: [],
};
export default config;
