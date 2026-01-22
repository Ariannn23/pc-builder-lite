import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando sembrado de datos (CORREGIDO)...");

  // 1. Limpiar base de datos
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

  // 4. Crear Productos (Usando imageUrl)

  // --- CPUs ---
  await prisma.product.createMany({
    data: [
      {
        name: "Intel Core i3-12100F",
        price: 110,
        imageUrl: "/products/core-i3-12100f.jpg", 
        stock: 20,
        categoryId: catCpu.id,
        socketId: lga1700.id,
        powerWatts: 58,
      },
      {
        name: "Intel Core i5-12400F",
        price: 150,
        imageUrl: "/products/core-i5-12400f.jpg",
        stock: 15,
        categoryId: catCpu.id,
        socketId: lga1700.id,
        powerWatts: 65,
      },
      {
        name: "Intel Core i7-12700K",
        price: 320,
        imageUrl: "/products/core-i7-12700k.jpg",
        stock: 8,
        categoryId: catCpu.id,
        socketId: lga1700.id,
        powerWatts: 190,
      },
      {
        name: "AMD Ryzen 5 7600X",
        price: 220,
        imageUrl: "/products/ryzen-5-7600x.jpg",
        stock: 12,
        categoryId: catCpu.id,
        socketId: am5.id,
        powerWatts: 105,
      },
      {
        name: "AMD Ryzen 7 7700X",
        price: 330,
        imageUrl: "/products/ryzen-7-7700x.jpg",
        stock: 5,
        categoryId: catCpu.id,
        socketId: am5.id,
        powerWatts: 105,
      },
    ],
  });

  // --- PLACAS MADRE ---
  await prisma.product.createMany({
    data: [
      {
        name: "ASUS Prime H610M-E D4",
        price: 99,
        imageUrl: "/products/asus-prime-h610m.jpg",
        stock: 10,
        categoryId: catMobo.id,
        compatibleSocketId: lga1700.id,
        memoryType: "DDR4",
      },
      {
        name: "Gigabyte B660M DS3H AX",
        price: 139,
        imageUrl: "/products/gigabyte-b660m.jpg",
        stock: 8,
        categoryId: catMobo.id,
        compatibleSocketId: lga1700.id,
        memoryType: "DDR4",
      },
      {
        name: "MSI PRO Z690-A WiFi (DDR5)",
        price: 219,
        imageUrl: "/products/msi-z690-a.jpg",
        stock: 4,
        categoryId: catMobo.id,
        compatibleSocketId: lga1700.id,
        memoryType: "DDR5",
      },
      {
        name: "ASRock B650M-HDV/M.2",
        price: 125,
        imageUrl: "/products/asrock-b650m.jpg",
        stock: 6,
        categoryId: catMobo.id,
        compatibleSocketId: am5.id,
        memoryType: "DDR5",
      },
      {
        name: "ASUS TUF Gaming X670E-PLUS",
        price: 309,
        imageUrl: "/products/asus-tuf-x670e.jpg",
        stock: 3,
        categoryId: catMobo.id,
        compatibleSocketId: am5.id,
        memoryType: "DDR5",
      },
    ],
  });

  // --- RAM ---
  await prisma.product.createMany({
    data: [
      {
        name: "Corsair Vengeance LPX 16GB DDR4",
        price: 45,
        imageUrl: "/products/corsair-vengeance-ddr4.jpg",
        stock: 50,
        categoryId: catRam.id,
        memoryType: "DDR4",
        powerWatts: 5,
      },
      {
        name: "Kingston Fury Beast 32GB DDR4",
        price: 79,
        imageUrl: "/products/kingston-fury-ddr4.jpg",
        stock: 20,
        categoryId: catRam.id,
        memoryType: "DDR4",
        powerWatts: 5,
      },
      {
        name: "Crucial RAM 16GB DDR5",
        price: 55,
        imageUrl: "/products/crucial-ddr5.jpg",
        stock: 30,
        categoryId: catRam.id,
        memoryType: "DDR5",
        powerWatts: 8,
      },
      {
        name: "G.SKILL Trident Z5 RGB 32GB DDR5",
        price: 115,
        imageUrl: "/products/gskill-trident-ddr5.jpg",
        stock: 15,
        categoryId: catRam.id,
        memoryType: "DDR5",
        powerWatts: 10,
      },
    ],
  });

  // --- GPU ---
  await prisma.product.createMany({
    data: [
      {
        name: "MSI GeForce RTX 3060 Ventus 2X",
        price: 289,
        imageUrl: "/products/msi-rtx-3060.jpg",
        stock: 10,
        categoryId: catGpu.id,
        powerWatts: 170,
      },
      {
        name: "ASUS Dual GeForce RTX 4060 OC",
        price: 299,
        imageUrl: "/products/asus-rtx-4060.jpg",
        stock: 8,
        categoryId: catGpu.id,
        powerWatts: 115,
      },
      {
        name: "Gigabyte GeForce RTX 4070",
        price: 549,
        imageUrl: "/products/gigabyte-rtx-4070.jpg",
        stock: 4,
        categoryId: catGpu.id,
        powerWatts: 200,
      },
      {
        name: "PowerColor Radeon RX 6600",
        price: 199,
        imageUrl: "/products/radeon-rx-6600.jpg",
        stock: 12,
        categoryId: catGpu.id,
        powerWatts: 132,
      },
      {
        name: "Sapphire Pulse Radeon RX 7600",
        price: 269,
        imageUrl: "/products/sapphire-rx-7600.jpg",
        stock: 7,
        categoryId: catGpu.id,
        powerWatts: 165,
      },
    ],
  });

  // --- ALMACENAMIENTO ---
  await prisma.product.createMany({
    data: [
      {
        name: "Kingston NV2 1TB M.2",
        price: 60,
        imageUrl: "/products/kingston-nv2.jpg",
        stock: 100,
        categoryId: catStorage.id,
        powerWatts: 5,
      },
      {
        name: "Samsung 980 PRO 1TB",
        price: 89,
        imageUrl: "/products/samsung-980-pro.jpg",
        stock: 25,
        categoryId: catStorage.id,
        powerWatts: 8,
      },
      {
        name: "WD Blue SN580 500GB",
        price: 45,
        imageUrl: "/products/wd-blue-sn580.jpg",
        stock: 40,
        categoryId: catStorage.id,
        powerWatts: 4,
      },
      {
        name: "Crucial P3 Plus 2TB",
        price: 119,
        imageUrl: "/products/crucial-p3-plus.jpg",
        stock: 10,
        categoryId: catStorage.id,
        powerWatts: 6,
      },
    ],
  });

  // --- FUENTES DE PODER ---
  await prisma.product.createMany({
    data: [
      {
        name: "EVGA 500 W1 500W",
        price: 49,
        imageUrl: "/products/evga-500w.jpg",
        stock: 20,
        categoryId: catPsu.id,
        powerWatts: 0,
      },
      {
        name: "Corsair RM750e 750W",
        price: 99,
        imageUrl: "/products/corsair-rm750e.jpg",
        stock: 15,
        categoryId: catPsu.id,
        powerWatts: 0,
      },
      {
        name: "Gigabyte UD850GM 850W",
        price: 109,
        imageUrl: "/products/gigabyte-ud850.jpg",
        stock: 8,
        categoryId: catPsu.id,
        powerWatts: 0,
      },
      {
        name: "MSI MAG A650BN 650W",
        price: 65,
        imageUrl: "/products/msi-mag-a650.jpg",
        stock: 25,
        categoryId: catPsu.id,
        powerWatts: 0,
      },
    ],
  });

  console.log("✅ Base de datos sembrada correctamente con imageUrl.");
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
