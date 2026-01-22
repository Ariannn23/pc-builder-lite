"use client";

import { useEffect } from "react";
import { useBuilderStore } from "@/store/useBuilder";

export default function CartCleaner() {
  const reset = useBuilderStore((state) => state.reset);

  useEffect(() => {
    // Al montarse este componente (cuando llegas a la página de éxito),
    // limpiamos el carrito inmediatamente.
    reset();
  }, [reset]);

  return null; // Este componente no renderiza nada visible
}
    