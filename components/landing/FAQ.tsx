"use client";
import React from "react";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Preguntas Frecuentes
          </h2>
          {/* Subrayado único para el subtítulo */}
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="space-y-3">
          {" "}
          {/* Espaciado más corto entre cards */}
          <FAQItem
            question="¿Es realmente gratis usar PC Builder Lite?"
            answer="Sí, 100% gratuito. No cobramos comisiones ni requerimos tarjeta de crédito para armar y compartir tus listas."
          />
          <FAQItem
            question="¿Los precios están actualizados?"
            answer="Intentamos mantener los precios lo más al día posible basándonos en el mercado global, aunque pueden variar según la tienda."
          />
          <FAQItem
            question="¿Cómo sé si las piezas caben en el gabinete?"
            answer="Nuestro sistema verifica el formato (ATX, Micro-ATX) y el largo de la GPU para advertirte de posibles conflictos."
          />
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group cursor-default">
      <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <HelpCircle size={18} />
        </div>
        <span className="text-[1rem] leading-tight">{question}</span>
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed pl-12">{answer}</p>
    </div>
  );
}
