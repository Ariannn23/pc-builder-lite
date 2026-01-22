"use client";
import { motion } from "framer-motion";
import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  title?: string;
  description?: string;
}

export default function UnderConstruction({
  title = "Estamos trabajando en ello",
  description = "Esta funcionalidad estará lista muy pronto. ¡Estamos construyendo algo increíble para ti!",
}: Props) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ rotate: -10, scale: 0.9 }}
        animate={{ rotate: 10, scale: 1.1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="relative w-32 h-32 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 mb-8 border-4 border-yellow-100/50"
      >
        <Construction size={64} />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white border-4 border-white animate-bounce">
          <span className="text-xs font-bold">VIP</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-lg text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed">
          {description}
        </p>

        <Link href="/">
          <button className="px-8 py-3.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto">
            <ArrowLeft size={20} /> Volver al Inicio
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
