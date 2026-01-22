import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Star } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import CartCleaner from "@/components/CartCleaner";
import BuildViewerActions from "@/components/BuildViewerActions";
import TicketModal from "@/components/TicketModal";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import { Metadata } from "next";

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const build = await prisma.build.findUnique({
    where: { id: params.id },
    include: { buildItems: { include: { product: true } } },
  });

  if (!build) {
    return {
      title: "Build No Encontrada",
    };
  }

  return {
    title: `${build.name} - $${build.totalPrice}`,
    description: `Mira esta PC Gamer que armé en PC Builder Lite. Incluye ${build.buildItems.length} componentes por un total de $${build.totalPrice}.`,
    openGraph: {
      title: `${build.name} | PC Builder Lite`,
      description: `Configuración de PC de $${build.totalPrice}. ¡Entra para ver los detalles!`,
      type: "website",
    },
  };
}

export default async function BuildPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const isSavedSuccess = searchParams.saved === "true";
  const isTemplate = searchParams.template === "true";

  const build = await prisma.build.findUnique({
    where: { id: params.id },
    include: {
      buildItems: {
        include: {
          product: {
            include: {
              category: true, // Necesitamos la categoría para el slug en el clonado
            },
          },
        },
      },
      //user: true // Podríamos mostrar el autor si quisiéramos
    },
  });

  if (!build) {
    return <div className="text-center py-20">Build no encontrada 😢</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Solo limpiamos el carrito si venimos de guardar exitosamente */}
      {isSavedSuccess && <CartCleaner />}

      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          {isSavedSuccess ? (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4 shadow-sm">
              <CheckCircle size={32} />
            </div>
          ) : isTemplate ? (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4 shadow-sm animate-pulse">
              <Star size={32} />
            </div>
          ) : null}

          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
            {isSavedSuccess ? "¡Configuración Guardada!" : build.name}
          </h1>

          <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
            {isSavedSuccess
              ? "Tu PC ha sido guardada en tu historial exitosamente."
              : build.description ||
                "Una configuración brutal creada para el máximo rendimiento."}
          </p>

          {!isTemplate && (
            <p className="text-slate-400 mt-4 text-xs font-mono bg-slate-50 inline-block px-2 py-1 rounded">
              ID: {build.id}
            </p>
          )}
        </div>

        <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {build.buildItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0 hover:bg-slate-50 p-2 rounded-lg transition"
            >
              <div>
                <span className="text-[10px] font-bold text-electric-500 uppercase tracking-wider block mb-1">
                  {item.product.category.name}
                </span>
                <span className="font-medium text-slate-800">
                  {item.product.name}
                </span>
              </div>
              <span className="font-bold text-slate-600 min-w-[80px] text-right">
                ${item.product.price}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center mb-8 shadow-xl shadow-slate-900/10">
          <span className="text-slate-400 font-medium">Total Presupuesto</span>
          <span className="text-3xl font-bold">${build.totalPrice}</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Si es template o visor, mostramos opción de personalizar/clonar */}
          {(!isSavedSuccess || isTemplate) && (
            <BuildViewerActions build={build} isTemplate={isTemplate} />
          )}

          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition active:scale-95 text-sm"
            >
              <ArrowLeft size={16} /> Volver al Inicio
            </Link>
            <ShareButton />
            <TicketModal build={build as any} />
          </div>
        </div>
      </div>
    </div>
  );
}
