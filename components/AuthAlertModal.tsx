"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X } from "lucide-react";
import Link from "next/link";

interface AuthAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  callbackUrl: string;
}

export default function AuthAlertModal({
  isOpen,
  onClose,
  callbackUrl,
}: AuthAlertModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md border border-slate-100"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-lg"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <LogIn size={32} />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Inicia sesión para guardar
            </h3>

            <p className="text-slate-500 mb-8 max-w-[280px]">
              Para no perder tu configuración, necesitas entrar a tu cuenta. ¡Es
              rápido!
            </p>

            <div className="flex flex-col gap-3 w-full">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Ir al Login
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition"
              >
                Cancelar
              </button>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              Tu PC actual se guardará automáticamente al volver.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
