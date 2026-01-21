"use client";

import { useBuilderStore } from "../store/useBuilder";
import { ShoppingCart, Zap, Trash2, Cpu } from "lucide-react";

export default function BuildSummary() {
  const { selectedParts, removePart, getTotalPrice, getTotalWatts } =
    useBuilderStore();
  const partsArray = Object.entries(selectedParts);

  return (
    <div className="bg-electric-900/50 p-6 rounded-2xl border border-electric-800 backdrop-blur-md shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-electric-800">
        <div className="bg-electric-600/20 p-2 rounded-lg text-electric-300">
          <ShoppingCart size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">Tu Configuración</h2>
      </div>

      <div className="space-y-3 mb-8 min-h-[120px]">
        {partsArray.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-electric-400/60 border-2 border-dashed border-electric-800/50 rounded-xl bg-electric-950/30">
            <Cpu size={32} className="mb-2 opacity-50" />
            <p className="text-sm">Tu PC está vacía</p>
          </div>
        ) : (
          partsArray.map(([slug, product]) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-electric-950/60 p-3 rounded-xl border border-electric-800/50 hover:border-electric-600 transition group"
            >
              <div className="overflow-hidden">
                <p className="text-[10px] text-electric-400 uppercase font-extrabold tracking-wider mb-0.5">
                  {slug}
                </p>
                <p className="text-sm text-white font-medium truncate w-32 group-hover:text-electric-200 transition">
                  {product.name}
                </p>
              </div>
              <button
                onClick={() => removePart(slug)}
                className="text-electric-600 hover:text-red-400 hover:bg-red-950/30 p-2 rounded-lg transition"
                title="Quitar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-electric-800 pt-5 space-y-4">
        <div className="flex justify-between text-electric-200 text-sm items-center bg-electric-950/40 p-2 rounded-lg">
          <span className="flex items-center gap-1.5 font-medium">
            <Zap size={14} className="text-yellow-400" /> Consumo:
          </span>
          <span className="font-mono font-bold text-white">
            {getTotalWatts()} W
          </span>
        </div>

        <div className="flex justify-between items-end">
          <span className="text-electric-200 font-medium pb-1">
            Total estimado:
          </span>
          <span className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(165,109,255,0.4)]">
            ${getTotalPrice()}
          </span>
        </div>
      </div>

      <button className="w-full mt-6 bg-gradient-to-r from-electric-600 via-electric-500 to-electric-400 hover:to-electric-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-electric-900/50 hover:shadow-electric-500/30 transform hover:-translate-y-0.5 text-lg">
        Confirmar Armado
      </button>
    </div>
  );
}
