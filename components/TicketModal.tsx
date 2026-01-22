"use client";

// Actually, let's use a custom lightweight modal to avoid dependency assumption issues if shadcn isn't fully set up.
import { useState, useRef } from "react";
import { Download, Printer, X, Cpu, Zap, CreditCard } from "lucide-react";
import { Build, Product, BuildItem, Category } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

type BuildWithItems = Build & {
  buildItems: (BuildItem & {
    product: Product & { category: Category };
  })[];
};

interface Props {
  build: BuildWithItems;
}

export default function TicketModal({ build }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Escalar la impresion solo al contenido del ticket sería ideal, pero window.print imprime todo.
    // Una técnica rápida es añadir una clase al body o usar @media print
    const printContent = ticketRef.current;
    if (!printContent) return;

    // Simple print approach
    window.print();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
      >
        <Printer size={18} />
        Ver Ticket
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative bg-transparent w-full max-w-md"
            >
              {/* --- CYBERPUNK TICKET --- */}
              <div
                id="printable-ticket"
                ref={ticketRef}
                className="bg-white text-slate-900 p-6 rounded-3xl border border-slate-200 relative overflow-hidden font-mono shadow-2xl w-full max-w-[400px] mx-auto"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-3 bg-linear-to-r from-blue-600 via-sky-400 to-blue-600" />
                <div className="absolute -left-6 top-1/2 w-12 h-12 bg-slate-800 rounded-full" />
                <div className="absolute -right-6 top-1/2 w-12 h-12 bg-slate-800 rounded-full" />

                <div className="text-center mb-4 border-b border-slate-100 pb-4">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                      <Cpu size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-0.5">
                    PC Builder Lite
                  </h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    Comprobante Oficial
                  </p>
                </div>

                <div className="mb-4 text-sm max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent hover:scrollbar-thumb-blue-400 print:max-h-none print:overflow-visible">
                  <div className="flex justify-between items-center text-slate-400 text-xs uppercase mb-3 sticky top-0 bg-white/95 backdrop-blur-sm pb-2 border-b border-slate-100 z-10 font-bold">
                    <span>Producto</span>
                    <span>Precio</span>
                  </div>
                  <div className="space-y-3">
                    {build.buildItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start border-b border-slate-50 pb-2"
                      >
                        <div className="pr-4">
                          <span className="text-blue-600 text-[10px] block uppercase font-bold">
                            {item.product.category.name}
                          </span>
                          <span className="text-slate-800 font-bold block truncate max-w-[160px] text-xs">
                            {item.product.name}
                          </span>
                        </div>
                        <span className="font-mono text-slate-600 text-xs font-bold">
                          ${item.product.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-slate-200 pt-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-slate-500 text-xs uppercase font-bold">
                      Total Pagado
                    </span>
                    <span className="text-3xl font-black text-blue-600">
                      ${build.totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-600 uppercase font-medium">
                    <span>ID: {build.id.slice(0, 8)}</span>
                    <span>
                      {new Date(build.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Barcode Mock */}
                <div className="mt-4 opacity-20">
                  <div className="h-8 w-full bg-slate-900/10 flex items-center justify-center tracking-[1em] text-[10px] overflow-hidden whitespace-nowrap font-libre-barcode text-slate-900">
                    ||| ||| || ||| || ||| |||| || |
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3 print:hidden max-w-[400px] mx-auto">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 bg-white text-slate-950 font-bold py-3 rounded-xl hover:bg-slate-200 transition flex items-center justify-center gap-2"
                >
                  <Printer size={18} /> Imprimir / PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 flex items-center justify-center bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background-color: white;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-ticket,
          #printable-ticket * {
            visibility: visible;
          }
          #printable-ticket {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 450px; /* Estándar recibo */
            margin: 0;
            border: none;
            box-shadow: none;
          }
          /* Expandir lista al imprimir */
          .print:max-h-none {
            max-height: none !important;
            overflow: visible !important;
          }
          /* Ocultar botones de cierre y acciones */
          .print:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
