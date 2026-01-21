// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Empezando el seed...");

  // 1. Limpiar base de datos (por si corres esto dos veces)
  // Borramos en orden para no romper relaciones
  await prisma.buildItem.deleteMany();
  await prisma.build.deleteMany();
  await prisma.product.deleteMany();
  await prisma.socket.deleteMany();
  await prisma.category.deleteMany();

  // 2. Crear Categorías
  const catCpu = await prisma.category.create({
    data: { name: "Procesador", slug: "cpu" },
  });
  const catMobo = await prisma.category.create({
    data: { name: "Placa Madre", slug: "motherboard" },
  });
  const catRam = await prisma.category.create({
    data: { name: "Memoria RAM", slug: "ram" },
  });

  // 3. Crear Sockets
  const socketLga1700 = await prisma.socket.create({
    data: { name: "LGA 1700" },
  }); // Intel 12/13/14
  const socketAm5 = await prisma.socket.create({ data: { name: "AM5" } }); // Ryzen 7000

  // 4. Crear Productos (CPUs)
  await prisma.product.create({
    data: {
      name: "Intel Core i5-12400F",
      price: 150.0,
      imageUrl:
        "https://m.media-amazon.com/images/I/51051FiD9UL._AC_SL1000_.jpg",
      stock: 10,
      categoryId: catCpu.id,
      socketId: socketLga1700.id, // Es socket LGA1700
      powerWatts: 65,
    },
  });

  await prisma.product.create({
    data: {
      name: "AMD Ryzen 5 7600X",
      price: 220.0,
      imageUrl:
        "https://m.media-amazon.com/images/I/61sRsB6+sRL._AC_SL1000_.jpg",
      stock: 5,
      categoryId: catCpu.id,
      socketId: socketAm5.id, // Es socket AM5
      powerWatts: 105,
    },
  });

  // 5. Crear Productos (Motherboards)
  await prisma.product.create({
    data: {
      name: "ASUS Prime B660M-A D4",
      price: 130.0,
      imageUrl:
        "https://m.media-amazon.com/images/I/815uX7u2HQL._AC_SL1500_.jpg",
      stock: 8,
      categoryId: catMobo.id,
      compatibleSocketId: socketLga1700.id, // Soporta Intel
      memoryType: "DDR4",
      formFactor: "mATX",
    },
  });

  await prisma.product.create({
    data: {
      name: "Gigabyte B650 AORUS Elite AX",
      price: 200.0,
      imageUrl:
        "https://m.media-amazon.com/images/I/81d6mY+a9HL._AC_SL1500_.jpg",
      stock: 3,
      categoryId: catMobo.id,
      compatibleSocketId: socketAm5.id, // Soporta AMD
      memoryType: "DDR5",
      formFactor: "ATX",
    },
  });

  // 6. Crear Productos (RAM)
  await prisma.product.create({
    data: {
      name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4",
      price: 45.0,
      categoryId: catRam.id,
      memoryType: "DDR4",
    },
  });

  console.log("✅ Seed completado con éxito.");
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
