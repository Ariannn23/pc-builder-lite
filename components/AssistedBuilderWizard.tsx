"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Gamepad2,
  Briefcase,
  FileVideo,
  DollarSign,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { generateAutoBuild } from "@/app/actions";
import { useBuildStore } from "@/hooks/useBuildStore";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssistedBuilderWizard({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [usage, setUsage] = useState<"gaming" | "office" | "editing" | null>(
    null,
  );
  const [budget, setBudget] = useState<"low" | "medium" | "high" | null>(null);
  const [loading, setLoading] = useState(false);
  const { loadBuild } = useBuildStore();
  const router = useRouter();

  const handleFinish = async () => {
    if (!usage || !budget) return;
    setLoading(true);

    try {
      const result = await generateAutoBuild(usage, budget);
      if (result.success && result.components) {
        loadBuild(result.components);
        onClose();
        // Reset wizard state
        setTimeout(() => {
          setStep(1);
          setUsage(null);
          setBudget(null);
        }, 500);
      } else {
        alert(
          "No pudimos generar una build conm esas caracteristicas por falta de stock. Intenta otra combinación.",
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error al generar la build.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    // Paso 1: Uso
    {
      id: 1,
      title: "¿Para qué usarás tu PC?",
      options: [
        {
          id: "gaming",
          label: "Gaming",
          icon: Gamepad2,
          desc: "Jugar títulos AAA y competitivos en alta calidad.",
        },
        {
          id: "office",
          label: "Oficina / Estudio",
          icon: Briefcase,
          desc: "Navegación, Word/Excel, video llamadas.",
        },
        {
          id: "editing",
          label: "Creación de Contenido",
          icon: FileVideo,
          desc: "Edición de video, diseño 3D, streaming.",
        },
      ],
    },
    // Paso 2: Presupuesto
    {
      id: 2,
      title: "¿Cuál es tu presupuesto?",
      options: [
        {
          id: "low",
          label: "Económico (Entry)",
          icon: DollarSign,
          desc: "Lo mejor por cada dólar. Rendimiento base.",
        },
        {
          id: "medium",
          label: "Balanceado (Mid)",
          icon: DollarSign,
          desc: "El punto dulce entre precio y potencia.",
        },
        {
          id: "high",
          label: "Alto Rendimiento (High)",
          icon: DollarSign,
          desc: "Sin compromisos. Máxima velocidad.",
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                  <Bot size={16} />
                  <span className="text-xs font-bold tracking-wider uppercase">
                    Modo Asistido
                  </span>
                </div>
                <h2 className="text-2xl font-bold">Armado Inteligente</h2>
                <p className="text-violet-100 text-sm mt-1">
                  Responde 2 preguntas y diseñaremos tu PC ideal.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition"
                type="button"
                aria-label="Cerrar asistente"
              >
                <X size={20} className="cursor-pointer" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 min-h-[400px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 size={48} className="text-violet-600 animate-spin" />
                  <h3 className="text-xl font-bold text-slate-800">
                    Analizando compatibilidad...
                  </h3>
                  <p className="text-slate-500 max-w-xs">
                    Nuestros algoritmos están seleccionando las mejores piezas
                    para ti.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="bg-violet-100 text-violet-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                        {step}
                      </span>
                      {steps[step - 1].title}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {steps[step - 1].options.map((opt) => {
                        const isSelected =
                          step === 1 ? usage === opt.id : budget === opt.id;
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              if (step === 1) setUsage(opt.id as any);
                              else setBudget(opt.id as any);
                            }}
                            className={`p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden ${
                              isSelected
                                ? "border-violet-600 bg-violet-50"
                                : "border-slate-100 hover:border-violet-300 hover:shadow-lg"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 text-violet-600">
                                <CheckCircle
                                  size={18}
                                  className="fill-current text-violet-50"
                                />
                              </div>
                            )}
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${isSelected ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600"}`}
                            >
                              <Icon size={20} />
                            </div>
                            <p
                              className={`font-bold mb-1 ${isSelected ? "text-violet-900" : "text-slate-800"}`}
                            >
                              {opt.label}
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {opt.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Controls */}
                  <div className="pt-6 border-t border-slate-100 flex justify-between mt-6">
                    {step > 1 ? (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="text-slate-400 font-bold text-sm hover:text-slate-600 transition"
                      >
                        Atrás
                      </button>
                    ) : (
                      <div></div>
                    )}

                    <button
                      onClick={() => {
                        if (step < 2) setStep(step + 1);
                        else handleFinish();
                      }}
                      disabled={
                        (step === 1 && !usage) || (step === 2 && !budget)
                      }
                      className="bg-violet-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-violet-500/30 hover:bg-violet-700 hover:shadow-violet-600/40 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {step === 2 ? "Generar Build Mágica ✨" : "Siguiente"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
