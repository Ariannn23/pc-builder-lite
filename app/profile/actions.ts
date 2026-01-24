"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
  name?: string;
  username?: string;
  phone?: string;
  documentType?: string;
  documentNumber?: string;
  businessName?: string;
  taxId?: string;
  contactPreference?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autenticado" };
  }

  // Validaciones
  if (
    formData.documentType &&
    formData.documentType !== "DNI" &&
    !formData.documentNumber
  ) {
    return { error: "Debes ingresar el número de documento" };
  }

  if (formData.businessName && !formData.taxId) {
    return { error: "Debes ingresar el RUC si especificaste una Razón Social" };
  }

  if (formData.taxId && !formData.businessName) {
    return { error: "Debes ingresar la Razón Social si especificaste un RUC" };
  }

  try {
    // Verificar si el username ya existe (si se está cambiando)
    if (formData.username) {
      const existing = await prisma.user.findUnique({
        where: { username: formData.username },
      });

      if (existing && existing.id !== session.user.id) {
        return { error: "Ese nombre de usuario ya está en uso" };
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...formData,
      },
    });

    revalidatePath("/profile");
    return { success: "Perfil actualizado correctamente" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Error al actualizar el perfil" };
  }
}
