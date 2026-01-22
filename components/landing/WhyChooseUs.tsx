"use client";
import React from "react";
import { Database, ShieldCheck, UserX } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              ¿Por qué elegir{" "}
              <span className="text-electric-600">PC Builder Lite</span>?
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-10" />
            <div className="space-y-6">
              <FeatureItem
                icon={Database}
                title="Base de datos Real"
                desc="Precios y especificaciones actualizados."
              />
              <FeatureItem
                icon={ShieldCheck}
                title="Anti-Errores Inteligente"
                desc="Te avisamos si intentas poner un CPU Intel en una placa AMD."
              />
              <FeatureItem
                icon={UserX}
                title="Sin Registro Requerido"
                desc="Empieza a armar inmediatamente, sin formularios molestos."
              />
            </div>
          </div>

          {/* Right Mockup */}
          <div className="lg:w-1/2 w-full order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 shadow-2xl relative aspect-[4/3] flex flex-col gap-4 overflow-hidden"
            >
              {/* Decorative Background Blob */}
              <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-electric-100/50 rounded-full blur-3xl pointer-events-none" />

              <div className="flex gap-4 h-[45%] z-10">
                <div className="w-1/2 bg-white rounded-3xl shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform duration-500"></div>
                <div className="w-1/2 bg-white rounded-3xl shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform duration-500"></div>
              </div>
              <div className="h-[55%] bg-white rounded-3xl shadow-sm border border-slate-100 z-10 hover:scale-[1.01] transition-transform duration-500"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex items-start gap-5 group cursor-default">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100">
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
