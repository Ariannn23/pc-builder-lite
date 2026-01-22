"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 lg:pt-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-electric-300 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-400 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-electric-100 text-electric-700 text-xs font-bold tracking-wider mb-6 border border-electric-200">
              V2.0 YA DISPONIBLE
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
              Construye tu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-600 to-blue-500">
                PC Gamer Ideal
              </span>
            </h1>
            <p className="text-xl text-slate-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Olvídate de las incompatibilidades. Nuestro algoritmo inteligente
              verifica todo por ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/builder">
                <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer">
                  Empezar Ahora <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Compatibilidad Verificada
                </h3>
                <p className="text-xs text-slate-500">
                  Intel Core i7 + RTX 4070
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 w-3/4 bg-slate-200 rounded-full"></div>
              <div className="h-3 w-1/2 bg-slate-200 rounded-full"></div>
            </div>
            <div className="absolute -top-6 -right-6 bg-electric-600 text-white p-4 rounded-2xl shadow-lg">
              <Zap size={32} fill="white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
