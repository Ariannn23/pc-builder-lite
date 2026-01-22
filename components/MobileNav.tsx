"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 text-slate-700 hover:bg-white hover:text-electric-600 transition shadow-sm"
        aria-label="Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2 border-b border-slate-50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Menú
            </p>
          </div>
          <div className="py-1">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-electric-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={16} /> Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-electric-600 hover:bg-blue-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <UserPlus size={16} /> Registrarse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
