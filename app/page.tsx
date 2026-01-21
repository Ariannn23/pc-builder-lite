import Link from "next/link";
import { getCategories, getProductsByCategory } from "@/lib/data";
import BuildSummary from "@/components/BuildSummary";
import ProductCard from "@/components/ProductCard";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const categorySlug = (searchParams.category as string) || "cpu";
  const categories = await getCategories();
  const products = await getProductsByCategory(categorySlug);

  const currentCategoryName =
    categories.find((c) => c.slug === categorySlug)?.name || "Componente";

  return (
    // FONDO: Degradado profundo desde tu violeta oscuro hacia negro
    <main className="min-h-screen bg-gradient-to-b from-electric-900 via-electric-950 to-black text-white pb-20 selection:bg-electric-400 selection:text-white">
      {/* HEADER: Efecto cristal con bordes violetas */}
      <header className="border-b border-electric-800 bg-electric-950/60 backdrop-blur-xl p-6 mb-8 sticky top-0 z-20 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              PC Builder{" "}
              <span className="text-electric-300 drop-shadow-[0_0_15px_rgba(165,109,255,0.6)]">
                Lite
              </span>
            </h1>
            <p className="text-electric-200/70 text-sm font-medium">
              Configurador Inteligente v2.0
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-6">
          {/* TABS DE NAVEGACIÓN */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const isActive = cat.slug === categorySlug;
              return (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className={`
                    px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap border
                    ${
                      isActive
                        ? "bg-electric-600 border-electric-400 text-white shadow-[0_0_20px_rgba(80,45,238,0.5)] scale-105"
                        : "bg-electric-900/40 border-electric-800 text-electric-300 hover:bg-electric-800 hover:text-white hover:border-electric-500"
                    }
                  `}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* LISTA DE PRODUCTOS */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <span className="w-1.5 h-8 bg-gradient-to-b from-electric-300 to-electric-600 rounded-full inline-block shadow-[0_0_10px_#a56dff]"></span>
              Selecciona tu {currentCategoryName}
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-electric-800 bg-electric-900/20 rounded-2xl text-electric-400">
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

        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 z-10">
            <BuildSummary />
          </div>
        </div>
      </div>
    </main>
  );
}
