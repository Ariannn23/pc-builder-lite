import { getCategories, getProductsByCategory } from "@/lib/data";
import BuildSummary from "@/components/BuildSummary";
import ProductCard from "@/components/ProductCard";
import CategoryTabs from "@/components/CategoryTabs";
import Link from "next/link";
import Logo from "@/components/Logo"; // <--- VOLVEMOS AL IMPORT ORIGINAL

interface BuilderProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuilderPage(props: BuilderProps) {
  const searchParams = await props.searchParams;
  const categorySlug = (searchParams.category as string) || "cpu";
  const categories = await getCategories();
  const products = await getProductsByCategory(categorySlug);

  const currentCategoryName =
    categories.find((c) => c.slug === categorySlug)?.name || "Componente";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 pb-20">
      {/* Header Compacto */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-blue-100 p-4 mb-8 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo SVG y Título */}
          <Link
            href="/"
            className="hover:opacity-80 transition flex items-center gap-2.5 group"
          >
            {/* USAMOS EL COMPONENTE LOGO OTRA VEZ */}
            <Logo
              size={36}
              className="group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
            />

            <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
              PC Builder{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-600 to-electric-400">
                Lite
              </span>
            </h1>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-electric-600 transition font-medium"
          >
            ← Volver al Inicio
          </Link>
        </div>
      </header>

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
            <BuildSummary />
          </div>
        </div>
      </div>
    </main>
  );
}
