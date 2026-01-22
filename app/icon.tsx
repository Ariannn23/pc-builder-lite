import { ImageResponse } from "next/og";

// Configuración del tamaño del favicon
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    // Renderizamos tu SVG directamente
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="electric_mouse"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>

      {/* Cuerpo del Mouse */}
      <rect
        x="10"
        y="6"
        width="20"
        height="28"
        rx="10"
        fill="white"
        stroke="url(#electric_mouse)"
        strokeWidth="2.5"
      />

      {/* Botones */}
      <path
        d="M10 17C10 17 15 19 20 19C25 19 30 17 30 17"
        stroke="url(#electric_mouse)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M20 6V19" stroke="url(#electric_mouse)" strokeWidth="1.5" />

      {/* Rueda */}
      <rect x="18" y="8" width="4" height="7" rx="2" fill="#2563eb" />

      {/* Luz RGB inferior */}
      <path
        d="M14 29C16 31 24 31 26 29"
        stroke="url(#electric_mouse)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>,
    {
      ...size,
    },
  );
}
