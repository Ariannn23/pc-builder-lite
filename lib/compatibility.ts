import { Product, Socket } from "@prisma/client";

// Extendemos Product para incluir las relaciones que vienen del fetch
export interface ProductWithRelations extends Product {
  socket?: Socket | null;
  compatibleSocket?: Socket | null;
  category: Category;
}
import { Category } from "@prisma/client";

export type CompatibilityIssue = {
  type: "error" | "warning";
  message: string;
  affectedSlugs: string[]; // slugs de las categorías afectadas (ej: 'cpu', 'motherboard')
};

export function checkCompatibility(
  components: Record<string, ProductWithRelations>,
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  const cpu = components["cpu"];
  const motherboard = components["motherboard"];
  const ram = components["ram"];
  const gpu = components["gpu"];
  const psu = components["psu"];

  // 1. Validar Socket (CPU vs Placa Madre)
  if (cpu && motherboard) {
    // cpu.socketId debe ser igual a motherboard.compatibleSocketId
    if (cpu.socketId && motherboard.compatibleSocketId) {
      if (cpu.socketId !== motherboard.compatibleSocketId) {
        issues.push({
          type: "error",
          message: `Incompatibilidad de Socket: El CPU usa ${cpu.socket?.name || "un socket"} pero la placa soporta ${motherboard.compatibleSocket?.name || "otro"}.`,
          affectedSlugs: ["cpu", "motherboard"],
        });
      }
    }
  }

  // 2. Validar Memoria RAM (Placa Madre vs RAM)
  if (motherboard && ram) {
    // Comparar memoryType (DDR4 vs DDR5)
    // Asumimos que el string es exacto ej: "DDR4"
    if (motherboard.memoryType && ram.memoryType) {
      const moboType = motherboard.memoryType.toUpperCase().trim();
      const ramType = ram.memoryType.toUpperCase().trim();

      if (moboType !== ramType) {
        issues.push({
          type: "error",
          message: `Incompatibilidad de RAM: La placa usa ${moboType} pero elegiste memoria ${ramType}.`,
          affectedSlugs: ["motherboard", "ram"],
        });
      }
    }
  }

  // 3. Validar Fuente de Poder (Watts Totales vs PSU)
  if (psu) {
    let totalWatts = 0;
    // Sumar watts de todos los componentes
    Object.values(components).forEach((comp) => {
      // No sumar la propia PSU al consumo (aunque sea 0)
      if (comp.id !== psu.id) {
        totalWatts += comp.powerWatts || 0;
      }
    });

    // Margen de seguridad del 20%
    const recommendedWatts = totalWatts * 1.2;
    // Wattage real de la PSU
    const psuWatts = psu.powerWatts || 0;
    // NOTA: Algunas fuentes tienen el wattage en el nombre o en un campo specs.
    // En el schema, 'powerWatts' en PSU debería representar su CAPACIDAD, no su consumo.
    // Sin embargo, si en el seed pusimos powerWatts: 0 para PSU, esto fallará.
    // Revisemos el seed: "EVGA 500 W1 500W", powerWatts: 0.
    // ERROR EN SEED: powerWatts en PSU debería ser la capacidad (500).
    // Asumiremos que si es PSU, powerWatts = capacidad.
    // Pero en el seed actual es 0.
    // FIX: Parsear el nombre si es 0? O simplemente alertar.

    // Si powerWatts es 0 en la PSU del seed, intentamos extraer del nombre
    let capacity = psuWatts;
    if (capacity === 0 && psu.name) {
      const match = psu.name.match(/(\d+)W/);
      if (match) capacity = parseInt(match[1]);
    }

    if (capacity > 0 && capacity < totalWatts) {
      // Error crítico: No enciende
      issues.push({
        type: "error",
        message: `Fuente Insuficiente: Tu sistema consume ~${totalWatts}W y la fuente solo da ${capacity}W.`,
        affectedSlugs: ["psu"],
      });
    } else if (capacity > 0 && capacity < recommendedWatts) {
      // Warning: Muy justo
      issues.push({
        type: "warning",
        message: `Fuente Justa: Consumo estimado ${totalWatts}W. Se recomienda al menos ${Math.ceil(recommendedWatts)}W para estabilidad.`,
        affectedSlugs: ["psu"],
      });
    }
  }

  return issues;
}
