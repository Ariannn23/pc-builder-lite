import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@prisma/client";

interface BuilderState {
  selectedParts: Record<string, Product>;
  addPart: (categorySlug: string, product: Product) => void;
  removePart: (categorySlug: string) => void;
  getTotalPrice: () => number;
  getTotalWatts: () => number;
  reset: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      selectedParts: {},

      addPart: (categorySlug, product) => {
        set((state) => {
          const newParts = { ...state.selectedParts };
          newParts[categorySlug] = product;

          // Lógica de Limpieza en Cascada (Cascading Reset) 🚿
          // Si cambiamos el CPU -> Se borran Placa Madre y RAM
          if (categorySlug === "cpu") {
            delete newParts["motherboard"];
            delete newParts["ram"];
          }

          // Si cambiamos la Placa Madre -> Se borra la RAM (por si cambia de DDR4 a DDR5)
          if (categorySlug === "motherboard") {
            delete newParts["ram"];
          }

          return { selectedParts: newParts };
        });
      },

      removePart: (categorySlug) => {
        set((state) => {
          const newParts = { ...state.selectedParts };
          delete newParts[categorySlug];
          return { selectedParts: newParts };
        });
      },

      getTotalPrice: () => {
        const parts = get().selectedParts;
        return Object.values(parts).reduce(
          (total, part) => total + part.price,
          0,
        );
      },

      getTotalWatts: () => {
        const parts = get().selectedParts;
        return Object.values(parts).reduce(
          (total, part) => total + (part.powerWatts || 0),
          0,
        );
      },

      reset: () => set({ selectedParts: {} }),
    }),
    {
      name: "pc-builder-storage-v2", // Nombre de la clave en localStorage actualizado para limpiar cache
      storage: createJSONStorage(() => localStorage), // Almacenamiento persistente en el navegador
    },
  ),
);
