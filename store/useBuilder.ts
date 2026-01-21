// store/useBuilder.ts
import { create } from "zustand";
// Importamos tipos de Prisma para autocompletado
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
    set((state) => ({
      selectedParts: {
        ...state.selectedParts,
        [categorySlug]: product,
      },
    }));
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
