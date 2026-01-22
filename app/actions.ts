"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function saveBuild(totalPrice: number, selectedParts: any) {
  let buildId: string;

  try {
    // Convertir el objeto de partes seleccionadas en un array
    const partsArray = Object.values(selectedParts);

    // Crear el build con sus items en una sola transacción
    const build = await prisma.build.create({
      data: {
        name: `PC Build - ${new Date().toLocaleDateString()}`,
        totalPrice: totalPrice,
        buildItems: {
          create: partsArray.map((product: any) => ({
            productId: product.id,
            quantity: 1,
          })),
        },
      },
    });

    buildId = build.id;
  } catch (error: any) {
    console.error("Error al guardar el build:", error);
    throw new Error("No se pudo guardar la configuración de tu PC");
  }

  // Redirigir a la página de éxito correcta (/build/[id])
  redirect(`/build/${buildId}`);
}
