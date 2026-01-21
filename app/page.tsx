// app/page.tsx
import { getCategories, getProductsByCategory } from "@/lib/data";
// SI ESTO DA ERROR ROJO: cambia la línea de arriba por:
// import { getCategories, getProductsByCategory } from '../lib/data'

export default async function Home() {
  const categories = await getCategories();
  const cpus = await getProductsByCategory("cpu");

  return (
    <main className="p-10 bg-slate-950 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">
        Prueba de Conexión: PC Builder Lite
      </h1>

      <div className="grid grid-cols-2 gap-10">
        {/* Columna 1: Categorías */}
        <section className="border p-5 rounded-lg border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">
            Categorías Encontradas:
          </h2>
          <ul className="list-disc pl-5">
            {categories.map((cat) => (
              <li key={cat.id} className="mb-2">
                <span className="font-bold text-yellow-400">{cat.name}</span>
                <span className="text-sm text-gray-400 ml-2">({cat.slug})</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Columna 2: CPUs */}
        <section className="border p-5 rounded-lg border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">CPUs Disponibles:</h2>
          <div className="space-y-4">
            {cpus.map((product) => (
              <div
                key={product.id}
                className="bg-slate-800 p-4 rounded flex justify-between"
              >
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-400">
                    Socket: {product.socket?.name || "N/A"} | TDP:{" "}
                    {product.powerWatts}W
                  </p>
                </div>
                <div className="text-green-400 font-bold">${product.price}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
