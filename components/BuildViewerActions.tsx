"use client";

import { useBuildStore } from "@/hooks/useBuildStore";
import { Copy, ArrowRight, PaintBucket } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Build, Product } from "@prisma/client";
import { ProductWithRelations } from "@/lib/compatibility";

interface Props {
  build: Build & { buildItems: any[] };
  isTemplate?: boolean;
}

export default function BuildViewerActions({ build, isTemplate }: Props) {
  const { loadBuild, setBuildName } = useBuildStore();
  const router = useRouter();

  const handleClone = () => {
    // 1. Convertir items del build al formato del store { slug: product }
    const components: Record<string, ProductWithRelations> = {};

    build.buildItems.forEach((item) => {
      const slug = item.product.category.slug;
      components[slug] = item.product;
    });

    // 2. Cargar en el store
    loadBuild(components);
    setBuildName(isTemplate ? build.name : `${build.name} (Copia)`);

    // 3. Redirigir al constructor
    router.push("/builder");
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleClone}
        className="flex-1 py-3.5 flex items-center justify-center gap-2 rounded-xl font-bold text-white bg-electric-600 hover:bg-electric-700 shadow-lg shadow-electric-500/30 transition transform active:scale-95"
      >
        {isTemplate ? (
          <>
            <PaintBucket size={18} /> Personalizar Diseño
          </>
        ) : (
          <>
            <Copy size={18} /> Clonar Configuración
          </>
        )}
      </button>
    </div>
  );
}
