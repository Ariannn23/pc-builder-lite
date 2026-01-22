"use client";

import { useBuilderStore } from "../store/useBuilder";
import { ShoppingCart, Zap, Trash2, Cpu, Loader2 } from "lucide-react";
import { saveBuild } from "@/app/actions"; // <--- Importamos la acción
import { useTransition } from "react"; // <--- Para el estado de carga

export default function BuildSummary() {
  const { selectedParts, removePart, getTotalPrice, getTotalWatts } =
    useBuilderStore();
  const partsArray = Object.entries(selectedParts);

  // Hook para saber si está guardando
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    // Iniciamos la transición (guardado)
    startTransition(() => {
      saveBuild(getTotalPrice(), selectedParts);
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-xl shadow-blue-900/5 sticky top-28">
      {/* ... (Toda la parte del Header y la Lista se queda IGUAL) ... */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="bg-gradient-to-br from-electric-500 to-electric-600 p-2 rounded-lg text-white shadow-lg shadow-electric-500/30">
          <ShoppingCart size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Tu Configuración</h2>
      </div>

      <div className="space-y-3 mb-8 min-h-[120px]">
        {partsArray.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Cpu size={32} className="mb-2 opacity-50 text-electric-300" />
            <p className="text-sm">Tu PC está vacía</p>
          </div>
        ) : (
          partsArray.map(([slug, product]) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-electric-200 transition group"
            >
              <div className="overflow-hidden">
                <p className="text-[10px] text-electric-500 uppercase font-bold tracking-wider mb-0.5">
                  {slug}
                </p>
                <p className="text-sm text-slate-800 font-semibold truncate w-32 group-hover:text-electric-700 transition">
                  {product.name}
                </p>
              </div>
              <button
                onClick={() => removePart(slug)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                title="Quitar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      {/* ... (Fin de la parte igual) ... */}

      <div className="border-t border-slate-100 pt-5 space-y-4">
        <div className="flex justify-between text-slate-600 text-sm items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
          <span className="flex items-center gap-1.5 font-medium text-electric-700">
            <Zap size={16} className="text-electric-500" /> Consumo:
          </span>
          <span className="font-mono font-bold text-slate-900">
            {getTotalWatts()} W
          </span>
        </div>

        <div className="flex justify-between items-end px-1">
          <span className="text-slate-500 font-medium pb-1">
            Total estimado:
          </span>
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-electric-800">
            ${getTotalPrice()}
          </span>
        </div>
      </div>

      {/* BOTÓN CONECTADO */}
      <button
        onClick={handleSave}
        disabled={isPending || partsArray.length === 0}
        className="w-full mt-6 bg-gradient-to-r from-electric-600 via-electric-500 to-electric-400 hover:to-electric-300 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-electric-500/25 hover:shadow-electric-500/40 transform hover:-translate-y-0.5 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" /> Guardando...
          </>
        ) : (
          "Confirmar Armado"
        )}
      </button>
    </div>
  );
}
