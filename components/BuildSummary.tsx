// components/BuildSummary.tsx
"use client";

import { useBuilderStore } from "../store/useBuilder"; // Nota la ruta relativa

export default function BuildSummary() {
  const { selectedParts, removePart, getTotalPrice, getTotalWatts } =
    useBuilderStore();
  const partsArray = Object.entries(selectedParts);

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 sticky top-4">
      <h2 className="text-xl font-bold text-white mb-4">Tu PC Gamer</h2>

      <div className="space-y-4 mb-6 min-h-[100px]">
        {partsArray.length === 0 ? (
          <p className="text-gray-500 text-sm text-center italic py-4">
            Selecciona componentes...
          </p>
        ) : (
          partsArray.map(([slug, product]) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700"
            >
              <div className="overflow-hidden">
                <p className="text-xs text-blue-400 uppercase font-bold mb-1">
                  {slug}
                </p>
                <p className="text-sm text-white font-medium truncate w-32">
                  {product.name}
                </p>
              </div>
              <button
                onClick={() => removePart(slug)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded p-1 transition"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-700 pt-4 space-y-2">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Consumo:</span>
          <span>{getTotalWatts()} W</span>
        </div>
        <div className="flex justify-between text-white text-xl font-bold">
          <span>Total:</span>
          <span className="text-green-400">${getTotalPrice()}</span>
        </div>
      </div>
    </div>
  );
}
