"use client";

import { useState, useMemo } from "react";
import { ProductWithRelations } from "@/lib/compatibility";
import ProductCard from "./ProductCard";
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  products: ProductWithRelations[];
}

export default function FilterableProductGrid({ products }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">(
    "price-asc",
  );

  // Filtrado y Ordenamiento
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // 1. Buscador
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        // 2. Rango de Precio
        const price = product.price;
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        const matchesPrice = price >= min && price <= max;

        // 3. Stock
        const matchesStock = hideOutOfStock ? product.stock > 0 : true;

        return matchesSearch && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, searchTerm, minPrice, maxPrice, hideOutOfStock, sortBy]);

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar componente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-electric-400 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition border ${
              showFilters
                ? "bg-electric-50 text-electric-600 border-electric-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={18} />
            Filtros
          </button>
        </div>

        {/* Panel de Filtros Expandible */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-6 text-sm">
                {/* Rango de Precios */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Precio
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-electric-400"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-electric-400"
                    />
                  </div>
                </div>

                {/* Ordenar por */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Ordenar
                  </label>
                  <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200 w-fit">
                    <button
                      onClick={() => setSortBy("price-asc")}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition ${sortBy === "price-asc" ? "bg-white text-electric-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Menor-Mayor
                    </button>
                    <button
                      onClick={() => setSortBy("price-desc")}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition ${sortBy === "price-desc" ? "bg-white text-electric-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Mayor-Menor
                    </button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Estado
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition ${hideOutOfStock ? "bg-electric-500 border-electric-500" : "bg-white border-slate-300"}`}
                    >
                      {hideOutOfStock && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={hideOutOfStock}
                      onChange={(e) => setHideOutOfStock(e.target.checked)}
                      className="hidden"
                    />
                    <span className="text-slate-600">Ocultar Agotados</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid de Productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 bg-white/50 rounded-2xl text-slate-400">
          <Filter size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-lg">
            No se encontraron productos con estos filtros.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setMinPrice("");
              setMaxPrice("");
              setHideOutOfStock(false);
            }}
            className="text-sm text-electric-500 font-semibold mt-2 hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
