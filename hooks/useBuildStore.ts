import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@prisma/client";

export interface BuildState {
  buildName: string;
  // Usamos un Record para guardar el producto seleccionado por cada slug de categoría
  // Ej: { cpu: ProdutoA, gpu: ProductoB }
  selectedComponents: Record<string, Product>;

  // Acciones
  setBuildName: (name: string) => void;
  setComponent: (categorySlug: string, product: Product) => void;
  removeComponent: (categorySlug: string) => void;
  loadBuild: (components: Record<string, Product>) => void; // Nueva acción
  clearBuild: () => void;

  // Computed (helpers)
  getTotalPrice: () => number;
  getEstimatedWatts: () => number;
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      buildName: "Mi PC Gamer",
      selectedComponents: {},

      setBuildName: (name) => set({ buildName: name }),

      setComponent: (slug, product) =>
        set((state) => ({
          selectedComponents: {
            ...state.selectedComponents,
            [slug]: product,
          },
        })),

      removeComponent: (slug) =>
        set((state) => {
          const newComponents = { ...state.selectedComponents };
          delete newComponents[slug];
          return { selectedComponents: newComponents };
        }),

      loadBuild: (components) => set({ selectedComponents: components }),

      clearBuild: () =>
        set({ selectedComponents: {}, buildName: "Mi PC Gamer" }),

      getTotalPrice: () => {
        const components = get().selectedComponents;
        return Object.values(components).reduce(
          (total, item) => total + item.price,
          0,
        );
      },

      getEstimatedWatts: () => {
        const components = get().selectedComponents;
        return Object.values(components).reduce(
          (total, item) => total + (item.powerWatts || 0),
          0,
        );
      },
    }),
    {
      name: "pc-builder-storage", // key en localStorage
    },
  ),
);
