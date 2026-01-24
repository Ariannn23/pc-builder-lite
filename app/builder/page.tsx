"use client";
import { getCategories, getProductsByCategory } from "@/lib/data";
import BuildSummary from "@/components/BuildSummary";
import FilterableProductGrid from "@/components/FilterableProductGrid";
import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";

interface BuilderProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import AssistedBuilderWizard from "@/components/AssistedBuilderWizard";
import Loader from "@/components/Loader";
import { Bot, Wand2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function BuilderPage() {
  const [showWizard, setShowWizard] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || "cpu";

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [currentCategoryName, setCurrentCategoryName] = useState("Componente");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCategories(), getProductsByCategory(categorySlug)]).then(
      ([cats, prods]) => {
        setCategories(cats);
        setProducts(prods);
        setLoading(false);
      },
    );
  }, [categorySlug]);

  useEffect(() => {
    if (categories.length > 0) {
      setCurrentCategoryName(
        categories.find((c) => c.slug === categorySlug)?.name || "Componente",
      );
    }
  }, [categories, categorySlug]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 pb-20 pt-28">
      {/* Header eliminado porque ahora usamos el Navbar global */}

      <div className="max-w-7xl mx-auto px-6 mb-2 flex justify-end">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-slate-800 transition flex items-center gap-1"
        >
          ← Volver al Inicio
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center min-h-[50vh]">
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CategoryTabs categories={categories} activeSlug={categorySlug} />

            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-electric-400 to-electric-700 rounded-full inline-block shadow-lg shadow-electric-500/30"></span>
                  Selecciona tu {currentCategoryName}
                </h2>

                <button
                  onClick={() => setShowWizard(true)}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:shadow-violet-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Bot size={18} />
                  Modo Asistido
                </button>
              </div>

              {/* Grid de Productos con Filtros */}
              <FilterableProductGrid products={products} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 z-10">
              <BuildSummary session={session} />
            </div>
          </div>
        </div>
      )}

      <AssistedBuilderWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
      />
    </main>
  );
}
