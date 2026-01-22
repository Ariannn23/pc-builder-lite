"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Alex G.",
    role: "Gamer",
    text: "Increíble facilidad para verificar sockets.",
  },
  {
    name: "Maria P.",
    role: "Diseñadora",
    text: "Armé mi workstation sin errores en minutos.",
  },
  {
    name: "Carlos D.",
    role: "IT Manager",
    text: "La mejor base de datos de componentes.",
  },
  {
    name: "Kevin S.",
    role: "Streamer",
    text: "El diseño es de otro nivel, muy intuitivo.",
  },
  {
    name: "Laura M.",
    role: "Arquitecta",
    text: "Pude compartir mi build al instante.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-sky-50 border-t border-slate-100 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          La comunidad confía en nosotros
        </h2>
        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-4" />
        <p className="text-slate-500 mt-2 text-lg">
          Miles de setups armados con éxito cada mes.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Máscara de desvanecimiento mejorada para el fondo sky-50 */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white via-white/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white via-white/40 to-transparent z-10 pointer-events-none" />

        <div className="flex">
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-8 py-10 px-4"
          >
            {[...reviews, ...reviews, ...reviews, ...reviews].map(
              (item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{
                    y: -15,
                    scale: 1.02,
                    boxShadow:
                      "0 20px 25px -5px rgb(37 99 235 / 0.1), 0 8px 10px -6px rgb(37 99 235 / 0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex-shrink-0 bg-white p-8 rounded-[2rem] border border-blue-50 shadow-sm cursor-default"
                >
                  <div className="flex gap-1 text-yellow-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-slate-600 mb-8 italic leading-relaxed text-[1.05rem] min-h-[80px]">
                    "{item.text}"
                  </p>

                  <div className="flex items-center gap-4">
                    {/* Avatar adaptado a la colorimetría azul eléctrica */}
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-200">
                      {item.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 leading-none mb-1">
                        {item.name}
                      </p>
                      <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
