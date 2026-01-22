"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    // 1. Copiamos la URL actual al portapapeles
    navigator.clipboard.writeText(window.location.href);

    // 2. Cambiamos el estado para mostrar feedback visual
    setCopied(true);

    // 3. Después de 2 segundos, volvemos a la normalidad
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleShare}
      className={`
        flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all duration-300 shadow-lg transform active:scale-95
        ${
          copied
            ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" // Estado Éxito
            : "bg-electric-600 hover:bg-electric-500 shadow-electric-500/20" // Estado Normal
        }
      `}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? "¡Link Copiado!" : "Compartir"}
    </button>
  );
}
