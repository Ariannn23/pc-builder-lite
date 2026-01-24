"use client";

import { ProductWithRelations } from "@/lib/compatibility";
import { useBuildStore } from "@/hooks/useBuildStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, ArrowRight, Check } from "lucide-react";

interface PreBuiltPC {
  id: string;
  name: string;
  price: string; // Display price (static or computed)
  description: string;
  gradient: string;
  isDark: boolean;
  components: Record<string, ProductWithRelations>;
}

interface Props {
  builds: PreBuiltPC[];
}

export default function PreBuiltGrid({ builds }: Props) {
  const { loadBuild, setBuildName } = useBuildStore();
  const router = useRouter();

  const handleArmarCargar = (build: PreBuiltPC) => {
    // 1. Cargar componentes en el store global
    // Usamos 'as any' para evitar el error de validación de tipos de TypeScript durante el build
    loadBuild(build.components as any);
    setBuildName(build.name);

    // 2. Redirigir al builder
    router.push("/builder");
  };
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {builds.map((build) => (
        <motion.div
          key={build.id}
          whileHover={{ y: -8 }}
          className={`relative p-8 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full
             ${
               build.isDark
                 ? "bg-slate-900 text-white shadow-xl shadow-blue-900/20"
                 : "bg-white text-slate-900 shadow-xl shadow-slate-200/50"
             }
           `}
          style={{ background: build.gradient }}
        >
          {/* Fondo decorativo */}
          <div className="absolute -right-6 -top-6 opacity-10">
            <Cpu size={140} />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block
                ${build.isDark ? "bg-white/10 text-white" : "bg-slate-900/10 text-slate-800"}
              `}
              >
                Pre-Configurado
              </span>
              <h3 className="text-2xl font-bold mb-2 leading-tight">
                {build.name}
              </h3>
              <p
                className={`text-sm opacity-80 ${build.isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                {build.description}
              </p>
            </div>

            <div className="text-3xl font-black mb-8">{build.price}</div>

            <div className="space-y-3 mb-8 flex-grow">
              {/* Mostrar algunos componentes clave */}
              {build.components["cpu"] && (
                <ComponentRow
                  label="CPU"
                  value={build.components["cpu"].name}
                  isDark={build.isDark}
                />
              )}
              {build.components["gpu"] && (
                <ComponentRow
                  label="GPU"
                  value={build.components["gpu"].name}
                  isDark={build.isDark}
                />
              )}
              {build.components["ram"] && (
                <ComponentRow
                  label="RAM"
                  value={build.components["ram"].name}
                  isDark={build.isDark}
                />
              )}
            </div>

            <button
              onClick={() => handleArmarCargar(build)}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95
                ${
                  build.isDark
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }
              `}
            >
              Armar ahora <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ComponentRow({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`flex items-center text-sm ${isDark ? "border-white/10" : "border-slate-100"} border-b pb-2 last:border-0`}
    >
      <span
        className={`w-12 font-bold opacity-60 ${isDark ? "text-white" : "text-slate-900"}`}
      >
        {label}
      </span>
      <span
        className={`font-medium truncate ${isDark ? "text-white" : "text-slate-700"}`}
      >
        {value}
      </span>
    </div>
  );
}
