"use client";
import React from "react";
import { Search, ShieldCheck, Share2 } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Armar tu PC nunca fue tan fácil
        </h2>

        {/* Subrayado decorativo centrado */}
        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-4" />

        <p className="text-slate-500 text-lg">
          Tres pasos simples hacia tu configuración ideal.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 relative">
        {/* Línea conectora decorativa (solo visible en escritorio) */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-200 -z-0" />

        <StepCard
          number="01"
          title="Elige tus piezas"
          desc="Selecciona procesador, gráfica y más desde nuestro catálogo actualizado."
          icon={<Search size={24} />}
        />
        <StepCard
          number="02"
          title="Valida al instante"
          desc="Nuestro motor detecta conflictos de energía o tamaño automáticamente."
          icon={<ShieldCheck size={24} />}
        />
        <StepCard
          number="03"
          title="Comparte tu Build"
          desc="Obtén un link único para presumir tu configuración o pedir opiniones."
          icon={<Share2 size={24} />}
        />
      </div>
    </section>
  );
}

function StepCard({
  number,
  title,
  desc,
  icon,
}: {
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center relative z-10 hover:shadow-md transition-shadow duration-300 group">
      {/* Contenedor del Icono con efecto hover */}
      <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>

      {/* Número de fondo estilizado */}
      <span className="absolute top-4 right-8 text-7xl font-black text-slate-50 -z-10 select-none">
        {number}
      </span>

      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed px-2">{desc}</p>
    </div>
  );
}
