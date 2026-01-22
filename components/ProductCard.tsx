"use client";
import { Cpu, Zap, MemoryStick, Layers } from "lucide-react";
import { useBuilderStore } from "../store/useBuilder";
import type { Product, Category, Socket } from "@prisma/client";
import { motion } from "framer-motion"; // <--- IMPORTANTE

// (Mantén tus interfaces y tipos iguales...)
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

  // (Mantén tu lógica de compatibilidad igual...)
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -5 }} // Efecto Flotar
      className={`
        border rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group bg-white
        ${!isCompatible ? "opacity-60 grayscale bg-slate-50" : ""} 
        ${
          isSelected
            ? "border-electric-400 ring-2 ring-electric-400/20 shadow-xl shadow-electric-500/10 bg-gradient-to-b from-blue-50/50 to-white"
            : "border-slate-200 hover:border-electric-300 hover:shadow-lg hover:shadow-blue-500/5"
        }
      `}
    >
      {/* (El resto de tu JSX de imagen y textos se queda IGUAL...) */}
      {!isCompatible && (
        <div className="absolute top-0 right-0 bg-red-50 text-red-500 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl border-l border-b border-red-100">
          Incompatible
        </div>
      )}

      <div>
        <div className="relative w-full h-40 mb-4 bg-white rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-100 shadow-inner">
          {/* Agregamos una animación extra a la imagen al hacer hover */}
          <motion.div
            className="w-full h-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-contain h-full w-full mix-blend-multiply"
              />
            ) : (
              <div className="text-slate-300 font-medium text-xs">
                Sin Imagen
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 text-lg leading-tight transition-colors">
            {product.name}
          </h3>
          <span className="text-lg font-bold ml-2 text-electric-600 bg-electric-50 px-2 rounded-md">
            ${product.price}
          </span>
        </div>

        <div className="text-sm text-slate-500 mb-5 space-y-1.5">
          {/* (Tus iconos se quedan igual...) */}
          {product.socket && (
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-electric-400" />
              <span>{product.socket.name}</span>
            </div>
          )}
          {product.compatibleSocket && (
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-electric-400" />
              <span>
                Soporta:{" "}
                <span className="text-slate-700 font-medium">
                  {product.compatibleSocket.name}
                </span>
              </span>
            </div>
          )}
          {product.powerWatts && product.powerWatts > 0 && (
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-500" />
              <span>{product.powerWatts}W</span>
            </div>
          )}
          {product.memoryType && (
            <div className="flex items-center gap-2">
              <MemoryStick size={16} className="text-electric-400" />
              <span>{product.memoryType}</span>
            </div>
          )}

          {!isCompatible && (
            <p className="text-red-500 font-medium text-xs mt-3 pt-2 border-t border-red-100 flex items-center gap-1">
              ⛔ {incompatibilityReason}
            </p>
          )}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }} // Efecto de click
        onClick={() => addPart(product.category.slug, product)}
        disabled={isSelected || !isCompatible}
        className={`
          w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors duration-200 shadow-md
          ${
            !isCompatible
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
              : isSelected
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white cursor-default border-transparent"
                : "bg-white text-electric-600 border border-electric-200 hover:bg-electric-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-electric-500/20"
          }
        `}
      >
        {isSelected
          ? "✓ INSTALADO"
          : !isCompatible
            ? "NO COMPATIBLE"
            : "AGREGAR"}
      </motion.button>
    </motion.div>
  );
}
