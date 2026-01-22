"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Esta función recibe los datos, los guarda y nos manda a la página de recibo
export async function saveBuild(totalPrice: number, parts: any) {
  if (totalPrice === 0 || Object.keys(parts).length === 0) {
    return; // No guardamos builds vacías
  }

  const newBuild = await prisma.build.create({
    data: {
      totalPrice,
      parts,
    },
  });

  // Redirigimos al usuario a la página de su build única
  redirect(`/build/${newBuild.id}`);
}
