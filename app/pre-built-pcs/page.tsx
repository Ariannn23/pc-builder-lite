import { prisma } from "@/lib/prisma";
import PreBuiltGrid from "@/components/PreBuiltGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/auth";

export const metadata = {
  title: "Configuraciones Pre-armadas | PC Builder Lite",
  description:
    "Elige una de nuestras configuraciones optimizadas y empieza a armar tu PC en segundos.",
};

export default async function PreBuiltPage() {
  const session = await auth();

  // IDs de los productos para cada build (basados en los datos disponibles)

  // 1. Snow White
  const snowIds = {
    cpu: "d18c987e-cfbf-4072-8e67-03af0cf207a6", // i7-12700K
    gpu: "d424333f-c61a-42cd-8927-5095038fdc06", // RTX 4070
    motherboard: "e6c9c6c7-5b4f-427f-95ff-8dd61c47b97f", // Z690
    ram: "24b9527e-d738-4b4a-96b1-5082581d9810", // Trident Z5
    storage: "a488ec1b-8670-47f1-8ebd-9f261dc77ad2", // 980 PRO
    psu: "563cd322-0e08-4035-bf7e-13bdd5dd7260", // RM750e
  };

  // 2. Cyberpunk (AMD 7700X + 4070)
  const cyberIds = {
    cpu: "73e4bcee-df96-492f-802d-5f9547eacabe", // Ryzen 7 7700X
    gpu: "d424333f-c61a-42cd-8927-5095038fdc06", // RTX 4070 (Reusada)
    motherboard: "bdce9826-1fee-4068-8e39-7a25ef71a0d6", // X670E
    ram: "438ca870-2d39-4350-8007-6e0ad474c9f0", // Crucial DDR5
    storage: "c175db01-05fc-4cfd-8c1e-cc840758a091", // P3 Plus
    psu: "e39c9289-0dbb-494e-bd1e-f7c3d54e00af", // UD850GM
  };

  // 3. Budget King (i5 + 4060)
  const budgetIds = {
    cpu: "13f59e59-5aef-4076-971c-29acb16aa8a0", // i5-12400F
    gpu: "94edeea0-f834-476a-b2d9-3adb93ec324f", // RTX 4060
    motherboard: "7745c23c-2c57-4355-b38d-7fd0102f6826", // B660M
    ram: "16cdfa79-c12b-48da-8a65-b7d2140f0591", // Fury DDR4
    storage: "27c93de5-25f2-41e5-a19e-2a75fd478af9", // SN580
    psu: "ae13c24c-76e5-4305-a261-d616a0e08a7f", // EVGA 500
  };

  const allIds = [
    ...Object.values(snowIds),
    ...Object.values(cyberIds),
    ...Object.values(budgetIds),
  ];

  // Fetch all needed products in one query
  const products = await prisma.product.findMany({
    where: { id: { in: allIds } },
  });

  const getProduct = (id: string) => products.find((p) => p.id === id);

  // Helper to build the components map safely
  const buildComponentsMap = (ids: Record<string, string>) => {
    const map: Record<string, any> = {};
    Object.entries(ids).forEach(([slug, id]) => {
      const p = getProduct(id);
      if (p) map[slug] = p;
    });
    return map;
  };

  const getFormattedPrice = (ids: Record<string, string>) => {
    const components = buildComponentsMap(ids);
    const total = Object.values(components).reduce(
      (sum: number, p: any) => sum + p.price,
      0,
    );
    return `$${total.toLocaleString()}`;
  };

  const builds = [
    {
      id: "snow-white",
      name: "Snow White Edition",
      price: getFormattedPrice(snowIds),
      description: "Estética inmaculada con potencia de sobra para 1440p.",
      gradient: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
      isDark: false,
      components: buildComponentsMap(snowIds),
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk Beast",
      price: getFormattedPrice(cyberIds),
      description: "Rendimiento extremo para Ray Tracing y 4K gaming.",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      isDark: true,
      components: buildComponentsMap(cyberIds),
    },
    {
      id: "budget",
      name: "Budget King",
      price: getFormattedPrice(budgetIds),
      description: "La mejor relación calidad-precio para 1080p competitivo.",
      gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
      isDark: true,
      components: buildComponentsMap(budgetIds),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar con sesión */}
      <div className="relative z-50">
        <Navbar session={session} />
      </div>

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              Configuraciones Pre-armadas
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Selecciona una base sólida y personalízala a tu gusto en nuestro
              constructor.
            </p>
          </div>

          <PreBuiltGrid builds={builds} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
