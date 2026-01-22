import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando sembrado de datos (V4.0 - Templates)...");

  // 1. Limpiar base de datos
  await prisma.buildItem.deleteMany();
  await prisma.build.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.socket.deleteMany();

  // 2. Crear Sockets
  const lga1700 = await prisma.socket.create({ data: { name: "LGA 1700" } });
  const am5 = await prisma.socket.create({ data: { name: "AM5" } });

  // 3. Crear Categorías
  const catCpu = await prisma.category.create({
    data: { name: "Procesador", slug: "cpu" },
  });
  const catMobo = await prisma.category.create({
    data: { name: "Placa Madre", slug: "motherboard" },
  });
  const catRam = await prisma.category.create({
    data: { name: "Memoria RAM", slug: "ram" },
  });
  const catGpu = await prisma.category.create({
    data: { name: "Tarjeta de Video", slug: "gpu" },
  });
  const catStorage = await prisma.category.create({
    data: { name: "Almacenamiento", slug: "storage" },
  });
  const catPsu = await prisma.category.create({
    data: { name: "Fuente de Poder", slug: "psu" },
  });

  // 4. Crear Productos
  // --- CPUs ---
  const i3 = await prisma.product.create({
    data: {
      name: "Intel Core i3-12100F",
      price: 110,
      imageUrl: "/products/core-i3-12100f.jpg",
      stock: 20,
      categoryId: catCpu.id,
      socketId: lga1700.id,
      powerWatts: 58,
    },
  });
  const i5 = await prisma.product.create({
    data: {
      name: "Intel Core i5-13600K",
      price: 300,
      imageUrl: "/products/core-i5-12400f.jpg",
      stock: 15,
      categoryId: catCpu.id,
      socketId: lga1700.id,
      powerWatts: 125,
    },
  });
  const ryzen9 = await prisma.product.create({
    data: {
      name: "AMD Ryzen 9 7900X",
      price: 450,
      imageUrl: "/products/ryzen-7-7700x.jpg",
      stock: 5,
      categoryId: catCpu.id,
      socketId: am5.id,
      powerWatts: 170,
    },
  });

  // --- MOBOS ---
  const moboIntel = await prisma.product.create({
    data: {
      name: "ASUS Prime Z790-P",
      price: 219,
      imageUrl: "/products/asus-prime-h610m.jpg",
      stock: 10,
      categoryId: catMobo.id,
      compatibleSocketId: lga1700.id,
      memoryType: "DDR5",
    },
  });
  const moboAmd = await prisma.product.create({
    data: {
      name: "ASUS ROG Strix X670E-F",
      price: 399,
      imageUrl: "/products/asus-tuf-x670e.jpg",
      stock: 5,
      categoryId: catMobo.id,
      compatibleSocketId: am5.id,
      memoryType: "DDR5",
    },
  });
  const moboBudget = await prisma.product.create({
    data: {
      name: "Gigabyte H610M S2H",
      price: 89,
      imageUrl: "/products/gigabyte-b660m.jpg",
      stock: 8,
      categoryId: catMobo.id,
      compatibleSocketId: lga1700.id,
      memoryType: "DDR4",
    },
  });

  // --- RAM ---
  const ramDdr5White = await prisma.product.create({
    data: {
      name: "Corsair Dominator Platinum RGB 32GB DDR5 (White)",
      price: 180,
      imageUrl: "/products/corsair-vengeance-ddr4.jpg",
      stock: 10,
      categoryId: catRam.id,
      memoryType: "DDR5",
      powerWatts: 10,
    },
  });
  const ramDdr5Black = await prisma.product.create({
    data: {
      name: "G.SKILL Trident Z5 RGB 64GB DDR5",
      price: 300,
      imageUrl: "/products/gskill-trident-ddr5.jpg",
      stock: 5,
      categoryId: catRam.id,
      memoryType: "DDR5",
      powerWatts: 15,
    },
  });
  const ramDdr4 = await prisma.product.create({
    data: {
      name: "Kingston Fury Beast 16GB DDR4",
      price: 45,
      imageUrl: "/products/kingston-fury-ddr4.jpg",
      stock: 20,
      categoryId: catRam.id,
      memoryType: "DDR4",
      powerWatts: 5,
    },
  });

  // --- GPU ---
  const rtx4070 = await prisma.product.create({
    data: {
      name: "Gigabyte GeForce RTX 4070 Aero OC (White)",
      price: 650,
      imageUrl: "/products/gigabyte-rtx-4070.jpg",
      stock: 5,
      categoryId: catGpu.id,
      powerWatts: 200,
    },
  });
  const rtx4090 = await prisma.product.create({
    data: {
      name: "ASUS ROG Strix GeForce RTX 4090",
      price: 1800,
      imageUrl: "/products/asus-rtx-4060.jpg",
      stock: 2,
      categoryId: catGpu.id,
      powerWatts: 450,
    },
  });
  const rtx3060 = await prisma.product.create({
    data: {
      name: "MSI GeForce RTX 3060 Ventus 2X",
      price: 289,
      imageUrl: "/products/msi-rtx-3060.jpg",
      stock: 10,
      categoryId: catGpu.id,
      powerWatts: 170,
    },
  });

  // --- PSU ---
  const psu750 = await prisma.product.create({
    data: {
      name: "Corsair RM750e 750W Gold",
      price: 99,
      imageUrl: "/products/corsair-rm750e.jpg",
      stock: 10,
      categoryId: catPsu.id,
      powerWatts: 750,
    },
  });
  const psu1000 = await prisma.product.create({
    data: {
      name: "ASUS ROG Thor 1000W Platinum II",
      price: 300,
      imageUrl: "/products/gigabyte-ud850.jpg",
      stock: 3,
      categoryId: catPsu.id,
      powerWatts: 1000,
    },
  });
  const psu500 = await prisma.product.create({
    data: {
      name: "EVGA 500 W1",
      price: 49,
      imageUrl: "/products/evga-500w.jpg",
      stock: 15,
      categoryId: catPsu.id,
      powerWatts: 500,
    },
  });

  // --- FEATURED BUILDS (Templates) ---

  // 1. Snow White Edition
  await prisma.build.create({
    data: {
      name: "Snow White Edition",
      description:
        "Estética blanca inmaculada con potencia de sobra para 1440p.",
      totalPrice: 1450, // Aprox
      isFeatured: true,
      buildItems: {
        create: [
          { productId: i5.id, quantity: 1 },
          { productId: moboIntel.id, quantity: 1 },
          { productId: ramDdr5White.id, quantity: 1 },
          { productId: rtx4070.id, quantity: 1 },
          { productId: psu750.id, quantity: 1 },
        ],
      },
    },
  });

  // 2. Cyberpunk Beast
  await prisma.build.create({
    data: {
      name: "Cyberpunk Beast",
      description: "El rendimiento máximo. Nada se le resiste en 4K Ultra.",
      totalPrice: 2850, // Aprox
      isFeatured: true,
      buildItems: {
        create: [
          { productId: ryzen9.id, quantity: 1 },
          { productId: moboAmd.id, quantity: 1 },
          { productId: ramDdr5Black.id, quantity: 1 },
          { productId: rtx4090.id, quantity: 1 },
          { productId: psu1000.id, quantity: 1 },
        ],
      },
    },
  });

  // 3. Budget King
  await prisma.build.create({
    data: {
      name: "Budget King",
      description: "La mejor relación calidad-precio para 1080p competitivo.",
      totalPrice: 550, // Aprox
      isFeatured: true,
      buildItems: {
        create: [
          { productId: i3.id, quantity: 1 },
          { productId: moboBudget.id, quantity: 1 },
          { productId: ramDdr4.id, quantity: 1 },
          { productId: rtx3060.id, quantity: 1 },
          { productId: psu500.id, quantity: 1 },
        ],
      },
    },
  });

  console.log("✅ Base de datos sembrada con Templates!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
