// app/page.tsx
import Link from "next/link";
import { getCategories, getProductsByCategory } from "@/lib/data";
import BuildSummary from "@/components/BuildSummary";
import ProductCard from "@/components/ProductCard";

// 1. CAMBIO IMPORTANTE: Definimos searchParams como una Promesa (Promise)
interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home(props: HomeProps) {
  // 2. CAMBIO IMPORTANTE: Esperamos a que los parámetros estén listos
  const searchParams = await props.searchParams;

  // Ahora sí podemos leer la categoría de forma segura
  const categorySlug = (searchParams.category as string) || "cpu";

  // 3. Obtenemos datos
  const categories = await getCategories();
  const products = await getProductsByCategory(categorySlug);

  // Nombre bonito para el título
  const currentCategoryName =
    categories.find((c) => c.slug === categorySlug)?.name || "Componente";

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <header className="bg-blue-950/30 border-b border-blue-900/50 p-6 mb-8 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              PC Builder <span className="text-blue-500">Lite</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Configurador Inteligente v1.0
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: Catálogo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navegación */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const isActive = cat.slug === categorySlug;
              return (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className={`
                    px-5 py-2 rounded-full text-sm font-medium transition whitespace-nowrap border
                    ${
                      isActive
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50"
                        : "bg-slate-800 border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white"
                    }
                  `}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Grilla de Productos */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
              Selecciona tu {currentCategoryName}
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-lg text-slate-500">
                No hay productos disponibles en esta categoría.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BuildSummary />
          </div>
        </div>
      </div>
    </main>
  );
}
