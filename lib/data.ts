// lib/data.ts
import { prisma } from "./prisma"; // Import relativo directo porque están en la misma carpeta

// 1. Obtener todas las categorías
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// 2. Obtener productos por su "slug" de categoría (ej: traer solo CPUs)
export async function getProductsByCategory(categorySlug: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      include: {
        socket: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
