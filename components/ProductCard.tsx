// components/ProductCard.tsx
"use client";
import { Cpu, Zap, MemoryStick, Layers } from "lucide-react";
import { useBuilderStore } from "../store/useBuilder";
// Importamos tipos necesarios
import type { Product, Category, Socket } from "@prisma/client";

// Definimos el tipo completo con las relaciones que agregamos en data.ts
type ProductWithRelations = Product & {
  socket?: Socket | null;
  compatibleSocket?: Socket | null; // <--- Agregamos esto
  category: Category;
};

interface Props {
  product: ProductWithRelations;
}

export default function ProductCard({ product }: Props) {
  const { addPart, selectedParts } = useBuilderStore();

  // 1. Estado de selección
  const isSelected = selectedParts[product.category.slug]?.id === product.id;

  // 2. Lógica de Compatibilidad (El "Cerebro") 🧠
  let isCompatible = true;
  let incompatibilityReason = "";

  // REGLA A: Si soy una Placa Madre, debo coincidir con el CPU seleccionado
  if (product.category.slug === "motherboard") {
    const selectedCpu = selectedParts["cpu"];

    // Si hay un CPU elegido Y mi socket compatible es diferente al del CPU...
    if (selectedCpu && product.compatibleSocketId !== selectedCpu.socketId) {
      isCompatible = false;
      incompatibilityReason = `Solo compatible con ${product.compatibleSocket?.name}`;
    }
  }

  // REGLA B: Si soy RAM, debo coincidir con la Placa Madre seleccionada
  if (product.category.slug === "ram") {
    const selectedMobo = selectedParts["motherboard"];

    // Si hay Placa elegida Y mi tipo de memoria no coincide...
    if (selectedMobo && product.memoryType !== selectedMobo.memoryType) {
      isCompatible = false;
      incompatibilityReason = `Requiere placa ${product.memoryType}`;
    }
  }

  return (
    <div
      className={`
        border rounded-lg p-4 transition-all duration-200 flex flex-col justify-between relative overflow-hidden
        ${!isCompatible ? "opacity-50 grayscale border-red-900 bg-red-900/10" : ""} 
        ${
          isSelected
            ? "bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            : "bg-slate-900 border-slate-800 hover:border-slate-600"
        }
      `}
    >
      {/* Etiqueta de Incompatibilidad */}
      {!isCompatible && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 font-bold rounded-bl">
          INCOMPATIBLE
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-white leading-tight">{product.name}</h3>
          <span
            className={`${!isCompatible ? "text-gray-500" : "text-green-400"} font-bold ml-2`}
          >
            ${product.price}
          </span>
        </div>

        <div className="text-sm text-gray-400 mb-4 space-y-2">
          {/* Socket (Icono CPU) */}
          {product.socket && (
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-blue-400" />
              <span>{product.socket.name}</span>
            </div>
          )}

          {/* Socket Compatible (Icono Layers) */}
          {product.compatibleSocket && (
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-purple-400" />
              <span>Soporta: {product.compatibleSocket.name}</span>
            </div>
          )}

          {/* Watts (Icono Rayo) */}
          {product.powerWatts && product.powerWatts > 0 && (
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <span>{product.powerWatts}W</span>
            </div>
          )}

          {/* Memoria (Icono RAM) */}
          {product.memoryType && (
            <div className="flex items-center gap-2">
              <MemoryStick size={16} className="text-green-400" />
              <span>{product.memoryType}</span>
            </div>
          )}

          {/* Mensaje de error específico */}
          {!isCompatible && (
            <p className="text-red-400 font-bold text-xs mt-2 border-t border-red-900/50 pt-1 flex items-center gap-1">
              {incompatibilityReason}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => addPart(product.category.slug, product)}
        disabled={isSelected || !isCompatible} // Bloqueamos si ya está elegido O es incompatible
        className={`
          w-full py-2 rounded text-sm font-semibold transition-colors
          ${
            !isCompatible
              ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-transparent"
              : isSelected
                ? "bg-blue-600 text-white cursor-default"
                : "bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white border border-slate-700"
          }
        `}
      >
        {isSelected
          ? "Seleccionado"
          : !isCompatible
            ? "No Compatible"
            : "Seleccionar"}
      </button>
    </div>
  );
}
