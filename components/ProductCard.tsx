"use client";
import { Cpu, Zap, MemoryStick, Layers } from "lucide-react";
import { useBuildStore } from "@/hooks/useBuildStore";
import { checkCompatibility } from "@/lib/compatibility";
import type { Product, Category, Socket } from "@prisma/client";
import { motion } from "framer-motion";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
import { Star } from "lucide-react";

type ProductWithRelations = Product & {
  socket?: Socket | null;
  compatibleSocket?: Socket | null;
  category: Category;
};

interface Props {
  product: ProductWithRelations;
}

export default function ProductCard({ product }: Props) {
  const { setComponent, selectedComponents } = useBuildStore();
  const slug = product.category.slug;
  const isSelected = selectedComponents[slug]?.id === product.id;
  const hasStock = product.stock > 0;
  const [showReviews, setShowReviews] = useState(false);

  // Verificar compatibilidad usando la utilidad centralizada
  // Creamos un escenario hipotético: "Si elijo este producto, ¿hay problemas?"
  // Mantenemos los componentes actuales, pero reemplazamos/agregamos el actual
  const hypotheticalBuild = { ...selectedComponents, [slug]: product };
  const issues = checkCompatibility(hypotheticalBuild);

  // Filtramos issues que afecten a ESTA categoría
  // Ej: Si elijo una Mobo, y hay error de Socket, afecta a 'motherboard' -> Incompatible
  const relevantIssues = issues.filter(
    (issue) => issue.affectedSlugs.includes(slug) && issue.type === "error",
  );
  const isCompatible = relevantIssues.length === 0;

  // Extraer mensaje del primer problema relevante
  const incompatibilityReason =
    relevantIssues[0]?.message.split(":")[1]?.trim() || "No compatible";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className={`
        border rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group bg-white
        ${!isCompatible || !hasStock ? "opacity-60 grayscale bg-slate-50" : ""} 
        ${
          isSelected
            ? "border-electric-400 ring-2 ring-electric-400/20 shadow-xl shadow-electric-500/10 bg-gradient-to-b from-blue-50/50 to-white"
            : "border-slate-200 hover:border-electric-300 hover:shadow-lg hover:shadow-blue-500/5"
        }
      `}
    >
      {!isCompatible && (
        <div className="absolute top-0 right-0 bg-red-50 text-red-500 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl border-l border-b border-red-100 z-10">
          Incompatible
        </div>
      )}

      {!hasStock && (
        <div className="absolute top-0 left-0 bg-slate-800 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-br-xl z-10">
          Agotado
        </div>
      )}

      {/* Mock Review Modal */}
      <ReviewModal
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
        productId={product.id}
        productName={product.name}
      />

      <div>
        <div className="relative w-full h-40 mb-4 bg-white rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-100 shadow-inner">
          {/* Stars overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReviews(true);
            }}
            className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-slate-100 flex items-center gap-1 z-20 hover:bg-slate-50 transition cursor-pointer"
          >
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold text-slate-600">4.8</span>
          </button>
          <motion.div
            className="w-full h-full flex items-center justify-center p-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-contain max-h-full max-w-full mix-blend-multiply"
              />
            ) : (
              <div className="text-slate-300 font-medium text-xs">
                Sin Imagen
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight transition-colors line-clamp-2">
            {product.name}
          </h3>
          <span className="text-sm md:text-lg font-bold ml-2 text-electric-600 bg-electric-50 px-2 rounded-md whitespace-nowrap">
            ${product.price}
          </span>
        </div>

        <div className="text-xs text-slate-500 mb-5 space-y-1.5">
          {product.socket && (
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-electric-400" />
              <span>{product.socket.name}</span>
            </div>
          )}
          {product.compatibleSocket && (
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-electric-400" />
              <span>
                Cmp:{" "}
                <span className="text-slate-700 font-medium">
                  {product.compatibleSocket.name}
                </span>
              </span>
            </div>
          )}
          {product.powerWatts !== null && product.powerWatts > 0 && (
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" />
              <span>{product.powerWatts}W</span>
            </div>
          )}
          {product.memoryType && (
            <div className="flex items-center gap-2">
              <MemoryStick size={14} className="text-electric-400" />
              <span>{product.memoryType}</span>
            </div>
          )}

          {!isCompatible && (
            <p className="text-red-500 font-medium text-[10px] mt-3 pt-2 border-t border-red-100 flex items-center gap-1">
              ⛔ {incompatibilityReason}
            </p>
          )}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setComponent(slug, product)}
        disabled={isSelected || !isCompatible || !hasStock}
        className={`
          w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-colors duration-200 shadow-md
          ${
            !isCompatible || !hasStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
              : isSelected
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white cursor-default border-transparent"
                : "bg-white text-electric-600 border border-electric-200 hover:bg-electric-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-electric-500/20 cursor-pointer"
          }
        `}
      >
        {isSelected
          ? "✓ INSTALADO"
          : !isCompatible
            ? "NO COMPATIBLE"
            : !hasStock
              ? "AGOTADO"
              : "AGREGAR"}
      </motion.button>
    </motion.div>
  );
}
