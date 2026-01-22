import { getCategories, getProductsByCategory } from "@/lib/data";
import BuildSummary from "@/components/BuildSummary";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";

interface BuilderProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import { auth } from "@/auth";

export default async function BuilderPage(props: BuilderProps) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const categorySlug = (searchParams.category as string) || "cpu";
  const categories = await getCategories();
  const products = await getProductsByCategory(categorySlug);

  const currentCategoryName =
    categories.find((c) => c.slug === categorySlug)?.name || "Componente";

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

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CategoryTabs categories={categories} activeSlug={categorySlug} />

          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
              <span className="w-1.5 h-8 bg-gradient-to-b from-electric-400 to-electric-700 rounded-full inline-block shadow-lg shadow-electric-500/30"></span>
              Selecciona tu {currentCategoryName}
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 bg-white/50 rounded-2xl text-slate-400">
                <p className="text-lg">
                  No hay productos disponibles en esta categoría.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 z-10">
            <BuildSummary session={session} />
          </div>
        </div>
      </div>
    </main>
  );
}
