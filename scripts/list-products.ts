import { prisma } from "../lib/prisma";

async function main() {
  const products = await prisma.product.findMany({
    take: 50,
    include: { category: true },
  });
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
