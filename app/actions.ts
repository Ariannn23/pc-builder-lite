"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function saveBuild(totalPrice: number, selectedParts: any) {
  let buildId: string;

  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Convertir el objeto de partes seleccionadas en un array
    const partsArray = Object.values(selectedParts);

    // Crear el build con sus items en una sola transacción
    const build = await prisma.build.create({
      data: {
        name: `PC Build - ${new Date().toLocaleDateString()}`,
        totalPrice: totalPrice,
        userId: userId, // Asociamos el build al usuario si está logueado
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
  redirect(`/build/${buildId}?saved=true`);
}

export async function generateAutoBuild(usage: string, budget: string) {
  // Lógica de recomendación "Expert System" simplificada

  // 1. Definir presupuesto base aproximado
  // Bajo: ~$800 | Medio: ~$1500 | Alto: ~$3000+

  // 2. Definir Prioridades según Uso
  // Gaming -> GPU > CPU
  // Office -> CPU > RAM (GPU integrada o básica)
  // Editing -> CPU > RAM > GPU

  // Para simplificar esta demo, haremos una selección "best effort"
  // basada en el precio de los componentes disponibles en la BD.

  try {
    const products = await prisma.product.findMany({
      include: { category: true, socket: true, compatibleSocket: true },
    });

    // Agrupar por categorías
    const cpus = products
      .filter((p) => p.category.slug === "cpu")
      .sort((a, b) => a.price - b.price);
    const gpus = products
      .filter((p) => p.category.slug === "gpu")
      .sort((a, b) => a.price - b.price);
    const mobos = products
      .filter((p) => p.category.slug === "motherboard")
      .sort((a, b) => a.price - b.price);
    const rams = products
      .filter((p) => p.category.slug === "ram")
      .sort((a, b) => a.price - b.price);
    const storage = products
      .filter((p) => p.category.slug === "storage")
      .sort((a, b) => a.price - b.price);
    const psus = products
      .filter((p) => p.category.slug === "psu")
      .sort((a, b) => a.price - b.price);
    const cases = products
      .filter((p) => p.category.slug === "case")
      .sort((a, b) => a.price - b.price);
    const coolers = products
      .filter((p) => p.category.slug === "cooler")
      .sort((a, b) => a.price - b.price);

    let selectedCPU: any,
      selectedGPU: any,
      selectedMobo: any,
      selectedRAM: any,
      selectedStorage: any,
      selectedPSU: any,
      selectedCase: any,
      selectedCooler: any;

    // --- LÓGICA DE SELECCIÓN ---
    // Estrategia: Definir índices (0 = barato, mid = medio, length-1 = caro)

    const getLevel = (arr: any[]) => {
      if (budget === "low") return 0;
      if (budget === "medium") return Math.floor(arr.length / 2);
      return arr.length - 1; // High
    };

    // CPU Logic
    let cpuIdx = getLevel(cpus);
    if (usage === "editing" && budget !== "low")
      cpuIdx = Math.min(cpuIdx + 1, cpus.length - 1);
    selectedCPU = cpus[cpuIdx];

    // Mobo Logic (Must match socket)
    const compatibleMobos = mobos.filter(
      (m) => m.compatibleSocketId === selectedCPU?.socketId,
    );
    let moboIdx = getLevel(compatibleMobos);
    selectedMobo = compatibleMobos[moboIdx] || compatibleMobos[0]; // Fallback

    // GPU Logic
    let gpuIdx = getLevel(gpus);
    if (usage === "office") gpuIdx = 0; // Office needs minimal GPU
    if (usage === "gaming" && budget === "high") gpuIdx = gpus.length - 1;
    selectedGPU = gpus[gpuIdx];

    // RAM Logic (Must match memory type of Mobo)
    const compatibleRAMs = rams.filter(
      (r) => r.memoryType === selectedMobo?.memoryType,
    );
    let ramIdx = getLevel(compatibleRAMs);
    if (usage === "editing")
      ramIdx = Math.min(ramIdx + 1, compatibleRAMs.length - 1);
    selectedRAM = compatibleRAMs[ramIdx] || compatibleRAMs[0];

    // Misc Logic (Simple selection based on budget level)
    selectedStorage = storage[getLevel(storage)];
    selectedPSU = psus[getLevel(psus)];
    selectedCase = cases[getLevel(cases)];
    selectedCooler = coolers[getLevel(coolers)];

    // Construir objeto de retorno
    // Debe coincidir con el formato que espera useBuildStore.loadBuild()
    const buildComponents: Record<string, any> = {};
    if (selectedCPU) buildComponents["cpu"] = selectedCPU;
    if (selectedMobo) buildComponents["motherboard"] = selectedMobo;
    if (selectedGPU) buildComponents["gpu"] = selectedGPU;
    if (selectedRAM) buildComponents["ram"] = selectedRAM;
    if (selectedStorage) buildComponents["storage"] = selectedStorage;
    if (selectedPSU) buildComponents["psu"] = selectedPSU;
    if (selectedCase) buildComponents["case"] = selectedCase;
    if (selectedCooler) buildComponents["cooler"] = selectedCooler;

    return { success: true, components: buildComponents };
  } catch (error) {
    console.error("Auto Build Error:", error);
    return { success: false, error: "Failed to generate build" };
  }
}
