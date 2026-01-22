"use client";

import { useBuildStore } from "@/hooks/useBuildStore";
import { useEffect } from "react";

export default function CartCleaner() {
  const clearBuild = useBuildStore((state) => state.clearBuild);

  useEffect(() => {
    clearBuild();
  }, [clearBuild]);

  return null;
}
