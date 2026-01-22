"use client";
import { Sparkles } from "lucide-react";
import MagicButton from "@/components/MagicButton";

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto relative group">
        <div className="relative bg-[#0B1121] rounded-3xl p-10 md:p-20 text-center overflow-hidden border border-slate-800 shadow-2xl">
          {/* Patrón de puntos */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>

          {/* Brillo ambiental */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20"></div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm shadow-lg shadow-blue-900/20">
              <Sparkles size={14} className="text-blue-400" /> Empieza hoy mismo
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              ¿Listo para armar tu máquina?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Únete a miles de usuarios que ya diseñaron su setup ideal. Sin
              registros, sin costos, pura potencia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MagicButton href="/builder" />
              <span className="text-slate-500 text-sm mt-4 sm:mt-0 sm:ml-4">
                No requiere tarjeta de crédito
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
