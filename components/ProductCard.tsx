"use client";
import { Cpu, Zap, MemoryStick, Layers } from "lucide-react";
import { useBuilderStore } from "../store/useBuilder";
import type { Product, Category, Socket } from "@prisma/client";

type ProductWithRelations = Product & {
  socket?: Socket | null;
  compatibleSocket?: Socket | null;
  category: Category;
};

interface Props {
  product: ProductWithRelations;
}

export default function ProductCard({ product }: Props) {
  const { addPart, selectedParts } = useBuilderStore();
  const isSelected = selectedParts[product.category.slug]?.id === product.id;

  // Lógica de compatibilidad
  let isCompatible = true;
  let incompatibilityReason = "";

  if (product.category.slug === "motherboard") {
    const selectedCpu = selectedParts["cpu"];
    if (selectedCpu && product.compatibleSocketId !== selectedCpu.socketId) {
      isCompatible = false;
      incompatibilityReason = `Solo compatible con ${product.compatibleSocket?.name}`;
    }
  }

  if (product.category.slug === "ram") {
    const selectedMobo = selectedParts["motherboard"];
    if (selectedMobo && product.memoryType !== selectedMobo.memoryType) {
      isCompatible = false;
      incompatibilityReason = `Requiere placa ${product.memoryType}`;
    }
  }

  return (
    <div
      className={`
        border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group backdrop-blur-sm
        ${!isCompatible ? "opacity-60 grayscale border-red-900/30 bg-red-950/5" : ""} 
        ${
          isSelected
            ? "bg-electric-900/80 border-electric-400 shadow-[0_0_30px_rgba(108,67,244,0.3)] ring-1 ring-electric-400/50"
            : "bg-electric-900/40 border-electric-800 hover:border-electric-500 hover:bg-electric-800/60 hover:shadow-lg hover:shadow-electric-600/10"
        }
      `}
    >
      {/* Etiqueta Incompatible */}
      {!isCompatible && (
        <div className="absolute top-0 right-0 bg-red-600/90 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl shadow-sm">
          Incompatible
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-white text-lg leading-tight group-hover:text-electric-200 transition-colors">
            {product.name}
          </h3>
          <span
            className={`text-lg font-bold ml-2 ${
              !isCompatible
                ? "text-gray-500"
                : "text-electric-300 drop-shadow-sm"
            }`}
          >
            ${product.price}
          </span>
        </div>

        <div className="text-sm text-electric-200/70 mb-6 space-y-2.5">
          {product.socket && (
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-electric-500" />
              <span>{product.socket.name}</span>
            </div>
          )}
          {product.compatibleSocket && (
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-electric-500" />
              <span>
                Soporta:{" "}
                <span className="text-white font-medium">
                  {product.compatibleSocket.name}
                </span>
              </span>
            </div>
          )}
          {product.powerWatts && product.powerWatts > 0 && (
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <span>{product.powerWatts}W</span>
            </div>
          )}
          {product.memoryType && (
            <div className="flex items-center gap-2">
              <MemoryStick size={16} className="text-electric-500" />
              <span>{product.memoryType}</span>
            </div>
          )}

          {!isCompatible && (
            <p className="text-red-400 font-bold text-xs mt-3 border-t border-red-900/30 pt-2 flex items-center gap-2">
              ⛔ {incompatibilityReason}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => addPart(product.category.slug, product)}
        disabled={isSelected || !isCompatible}
        className={`
          w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 shadow-lg
          ${
            !isCompatible
              ? "bg-electric-950/50 text-electric-800 cursor-not-allowed border border-electric-900 shadow-none"
              : isSelected
                ? "bg-gradient-to-r from-electric-600 to-electric-500 text-white cursor-default border border-electric-400"
                : "bg-electric-950 text-electric-300 border border-electric-700 hover:bg-electric-300 hover:text-white hover:border-electric-300 hover:shadow-electric-500/40"
          }
        `}
      >
        {isSelected ? "INSTALADO" : !isCompatible ? "NO COMPATIBLE" : "AGREGAR"}
      </button>
    </div>
  );
}
