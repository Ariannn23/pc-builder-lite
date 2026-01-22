"use client";

"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, MessageCircle, Github } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-electric-950 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Columna 1: Logo */}
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-3 mb-6 cursor-pointer group w-fit"
            >
              <Logo
                size={40}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="font-extrabold text-white text-2xl tracking-tight">
                PC Builder <span className="text-electric-400">Lite</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-slate-500">
              La herramienta definitiva para diseñar y verificar tu próxima PC
              Gamer sin errores de compatibilidad.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">
              Navegación
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-electric-400 transition cursor-pointer"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/builder"
                  className="hover:text-electric-400 transition cursor-pointer"
                >
                  Constructor
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-electric-400 transition cursor-pointer"
                >
                  Demo Interactiva
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-electric-400 transition cursor-pointer"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-electric-400 transition cursor-pointer"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-electric-400 transition cursor-pointer"
                >
                  Libro de Reclamaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">
              Comunidad
            </h3>
            <div className="flex flex-wrap gap-3">
              <SocialButton
                href="https://github.com/tu-usuario"
                icon={<Github size={18} />}
                label="GitHub"
              />
              <SocialButton
                href="https://facebook.com"
                icon={<Facebook size={18} />}
                label="Facebook"
              />
              <SocialButton
                href="https://instagram.com"
                icon={<Instagram size={18} />}
                label="Instagram"
              />
              <SocialButton
                href="https://twitter.com"
                icon={<XIcon size={16} />}
                label="X (Twitter)"
              />
              <SocialButton
                href="https://wa.me/123456789"
                icon={<MessageCircle size={18} />}
                label="WhatsApp"
              />
            </div>
          </div>
        </div>

        {/* Barra inferior de Copyright & SharkCorp */}
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 PC Builder Lite. Todos los derechos reservados.</p>

          <div className="mt-4 md:mt-0 flex items-center gap-1">
            <span>Diseñado por</span>
            <a
              href="https://www.sharkcorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric-400 font-bold hover:text-white transition cursor-pointer"
            >
              www.sharkcorp.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Sub-componente interno para los botones
function SocialButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -5, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 bg-slate-800 text-slate-300 rounded-full flex items-center justify-center shadow-lg hover:bg-electric-600 hover:text-white transition-colors cursor-pointer border border-slate-700 hover:border-electric-500"
      aria-label={label}
    >
      {icon}
    </motion.a>
  );
}

// Logo de X (Twitter nuevo)
function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}
