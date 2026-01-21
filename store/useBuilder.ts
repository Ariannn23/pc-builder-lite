// store/useBuilder.ts
import { create } from "zustand";
import type { Product } from "@prisma/client";

interface BuilderState {
  selectedParts: Record<string, Product>;
  addPart: (categorySlug: string, product: Product) => void;
  removePart: (categorySlug: string) => void;
  getTotalPrice: () => number;
  getTotalWatts: () => number;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  selectedParts: {},

  addPart: (categorySlug, product) => {
    set((state) => {
      // 1. Copiamos el estado actual para no mutarlo directamente
      const newParts = { ...state.selectedParts };

      // 2. Guardamos la nueva pieza que el usuario eligió
      newParts[categorySlug] = product;

      // 3. Lógica de Limpieza en Cascada (Cascading Reset) 🚿
      // Esto es lo nuevo: Borramos dependencias para evitar conflictos

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

      // Opcional: Aquí también podrías hacer reset si quitan el CPU manualmente,
      // pero por ahora lo dejaremos simple.

      return { selectedParts: newParts };
    });
  },

  getTotalPrice: () => {
    const parts = get().selectedParts;
    return Object.values(parts).reduce((total, part) => total + part.price, 0);
  },

  getTotalWatts: () => {
    const parts = get().selectedParts;
    return Object.values(parts).reduce(
      (total, part) => total + (part.powerWatts || 0),
      0,
    );
  },
}));
