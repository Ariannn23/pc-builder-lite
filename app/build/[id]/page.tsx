import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import ShareButton from "@/components/ShareButton"; // 👈 IMPORTANTE

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BuildPage(props: Props) {
  const params = await props.params;
  const build = await prisma.build.findUnique({
    where: { id: params.id },
  });

  if (!build) {
    return <div className="text-center py-20">Build no encontrada 😢</div>;
  }

  const parts = build.parts as Record<string, any>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4 shadow-sm">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            ¡Configuración Guardada!
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            ID de Referencia:{" "}
            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 select-all">
              {build.id}
            </span>
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {Object.entries(parts).map(([category, product]: [string, any]) => (
            <div
              key={category}
              className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0"
            >
              <div>
                <span className="text-[10px] font-bold text-electric-500 uppercase tracking-wider block mb-1">
                  {category}
                </span>
                <span className="font-medium text-slate-800">
                  {product.name}
                </span>
              </div>
              <span className="font-bold text-slate-600">${product.price}</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center mb-8 shadow-xl shadow-slate-900/10">
          <span className="text-slate-400 font-medium">Total Presupuesto</span>
          <span className="text-3xl font-bold">${build.totalPrice}</span>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition active:scale-95"
          >
            <ArrowLeft size={18} /> Crear Nueva
          </Link>

          {/* Aquí está nuestro nuevo botón inteligente */}
          <ShareButton />
        </div>
      </div>
    </div>
  );
}
