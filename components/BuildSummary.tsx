"use client";

import { useBuildStore } from "@/hooks/useBuildStore";
import { ShoppingCart, Zap, Trash2, Cpu, Loader2 } from "lucide-react";
import { saveBuild } from "@/app/actions";
import { useTransition, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthAlertModal from "@/components/AuthAlertModal";

interface Props {
  session?: import("next-auth").Session | null;
}

export default function BuildSummary({ session: _propSession }: Props = {}) {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  // Forzar sincronización de sesión al montar el componente
  // (Esto se ejecuta cada vez que vuelves del login al builder)
  useEffect(() => {
    if (status !== "loading") {
      update();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const {
    selectedComponents,
    removeComponent,
    getTotalPrice,
    getEstimatedWatts,
  } = useBuildStore();
  const partsArray = Object.entries(selectedComponents);
  const [isPending, startTransition] = useTransition();

  // --- LÓGICA DE HIDRATACIÓN ---
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = () => {
    if (!session) {
      setShowAuthAlert(true);
      return;
    }

    startTransition(() => {
      saveBuild(getTotalPrice(), selectedComponents);
    });
  };

  // ... (loading state check remains)

  return (
    <>
      <AuthAlertModal
        isOpen={showAuthAlert}
        onClose={() => setShowAuthAlert(false)}
        callbackUrl="/builder"
      />

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white shadow-xl shadow-blue-900/5 sticky top-28">
        {/* ... (rest of the component UI remains exactly the same) */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="bg-gradient-to-br from-electric-500 to-electric-600 p-2 rounded-lg text-white shadow-lg shadow-electric-500/30">
            <ShoppingCart size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Tu Configuración</h2>
        </div>

        <div className="space-y-3 mb-8 min-h-[120px]">
          {!isClient || partsArray.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Cpu size={32} className="mb-2 opacity-50 text-electric-300" />
              <p className="text-sm">Tu PC está vacía</p>
            </div>
          ) : (
            partsArray.map(([slug, product]) => (
              <div
                key={product.id}
                className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-electric-200 transition group"
              >
                <div className="overflow-hidden">
                  <p className="text-[10px] text-electric-500 uppercase font-bold tracking-wider mb-0.5">
                    {slug}
                  </p>
                  <p className="text-sm text-slate-800 font-semibold truncate w-32 group-hover:text-electric-700 transition">
                    {product.name}
                  </p>
                </div>
                <button
                  onClick={() => removeComponent(slug)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition cursor-pointer"
                  title="Quitar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-4">
          <div className="flex justify-between text-slate-600 text-sm items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
            <span className="flex items-center gap-1.5 font-medium text-electric-700">
              <Zap size={16} className="text-electric-500" /> Consumo:
            </span>
            <span className="font-mono font-bold text-slate-900">
              {isClient ? getEstimatedWatts() : 0} W
            </span>
          </div>

          <div className="flex justify-between items-end px-1">
            <span className="text-slate-500 font-medium pb-1">
              Total estimado:
            </span>
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-electric-800">
              ${isClient ? getTotalPrice() : 0}
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending || partsArray.length === 0}
          className="w-full py-4 bg-gradient-to-r from-electric-500 to-electric-600 text-white rounded-xl font-bold shadow-lg shadow-electric-500/30 hover:shadow-electric-500/50 hover:scale-[1.02] transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> Guardando...
            </>
          ) : (
            "Confirmar Armado"
          )}
        </button>
      </div>
    </>
  );
}
