"use client";
import { motion } from "framer-motion";
import { Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Build } from "@prisma/client";

interface Props {
  builds: any[];
}

export default function Inspiration({ builds }: Props) {
  // Datos hardcodeados para restaurar la vista original
  const staticBuilds = [
    {
      id: "snow-white",
      name: "Snow White Edition",
      price: "$1,391",
      tags: ["RTX 4070", "i5-13600K"],
      gradient: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
      isDark: false,
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk Beast",
      price: "$1,471",
      tags: ["RTX 4070", "Ryzen 9"],
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      isDark: true,
    },
    {
      id: "budget",
      name: "Budget King",
      price: "$761",
      tags: ["RTX 4060", "i5-12400F"],
      gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
      isDark: true,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Inspiración Semanal
            </h2>
            <div className="w-16 h-1.5 bg-blue-600 rounded-full" />
            <p className="text-slate-500 mt-2">
              Configuraciones populares listas para ti.
            </p>
          </div>
          <Link
            href="/pre-built-pcs"
            className="text-blue-600 font-bold hover:text-blue-700 transition flex items-center gap-2 group cursor-pointer"
          >
            Ver configuraciones{" "}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {staticBuilds.map((build, index) => (
            <Link key={build.id} href="/pre-built-pcs">
              <BuildCard
                title={build.name}
                price={build.price}
                gradient={build.gradient}
                textColor={build.isDark ? "text-white" : "text-slate-900"}
                isDark={build.isDark}
                tags={build.tags}
                shadow="shadow-xl shadow-blue-500/20"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuildCard({
  title,
  price,
  gradient,
  textColor,
  isDark,
  tags,
  shadow,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      style={{ background: gradient }}
      className={`p-8 rounded-3xl ${textColor} ${shadow} relative overflow-hidden group cursor-pointer h-full flex flex-col justify-between`}
    >
      <div className="absolute -right-4 -top-4 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
        <Cpu size={120} />
      </div>
      <div className="relative z-10">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isDark ? "bg-white/10 text-white" : "bg-slate-900/10 text-slate-900"} mb-6 inline-block`}
        >
          Popular Build
        </span>
        <h3 className="text-2xl font-bold mb-1 tracking-tight">{title}</h3>
        <p className="text-xl font-black opacity-90 mb-6">{price}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className={`text-[11px] px-2.5 py-1 rounded-lg border ${isDark ? "border-white/20 bg-white/5" : "border-slate-900/10 bg-slate-900/5"} truncate max-w-[120px]`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
