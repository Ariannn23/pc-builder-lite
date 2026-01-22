"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  activeSlug: string;
}

export default function CategoryTabs({ categories, activeSlug }: Props) {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 px-1">
      <div className="flex gap-2 min-w-max">
        {categories.map((cat) => {
          const isActive = cat.slug === activeSlug;

          return (
            <Link
              key={cat.id}
              href={`/builder?category=${cat.slug}`}
              className="relative px-5 py-2.5 rounded-full text-sm font-bold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-electric-400"
            >
              {/* FONDO ANIMADO (El que se mueve) */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-gradient-to-r from-electric-600 to-electric-500 rounded-full shadow-lg shadow-electric-500/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* TEXTO (Encima del fondo) */}
              <span
                className={twMerge(
                  "relative z-10 transition-colors duration-200",
                  isActive
                    ? "text-white"
                    : "text-slate-500 hover:text-electric-600",
                )}
              >
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
