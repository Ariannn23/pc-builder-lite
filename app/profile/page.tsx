import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  // Obtener datos completos del usuario
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      documentType: true,
      documentNumber: true,
      businessName: true,
      taxId: true,
      contactPreference: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      country: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Serializar fechas para pasar al componente cliente
  const serializedUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-600 to-blue-600 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          <p className="text-slate-600 mt-2">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {/* Profile Form */}
        <ProfileForm user={serializedUser} />
      </div>
    </div>
  );
}
