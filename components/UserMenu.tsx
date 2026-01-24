"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User as UserIcon, Cpu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  user: User;
}

export default function UserMenu({ user }: Props) {
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
        className="flex items-center gap-2 px-2 py-1 pe-4 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 hover:bg-white hover:shadow-md transition cursor-pointer"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold uppercase border border-blue-200">
          {user.username?.[0] || user.name?.[0] || user.email?.[0] || "U"}
        </div>
        <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate hidden sm:block">
          {user.username || user.name?.split(" ")[0] || "Usuario"}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50 origin-top-right"
          >
            <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user.username || user.name || "Usuario"}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <Link
                href="/my-builds"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition w-full cursor-pointer"
              >
                <Cpu size={16} className="text-blue-500" /> Mis Armados
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition w-full cursor-pointer"
              >
                <UserIcon size={16} className="text-blue-500" /> Mi Perfil
              </Link>
            </div>

            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
              >
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
