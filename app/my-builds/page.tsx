import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Cpu, Calendar, DollarSign, ArrowRight } from "lucide-react";

export default async function MyBuildsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const builds = await prisma.build.findMany({
    where: {
      userId: session.user.id,
      // Aseguramos que solo traiga las que tienen este userId explícito
      NOT: {
        userId: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { buildItems: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">
              Mis Armados
            </h1>
            <p className="text-slate-500 mt-2">
              Historial de tus configuraciones guardadas
            </p>
          </div>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 text-electric-600 font-bold hover:underline"
          >
            + Nueva Build
          </Link>
        </div>

        {builds.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Cpu size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              Aún no tienes armados
            </h3>
            <p className="text-slate-500 mb-6">
              Empieza a configurar tu PC ideal ahora mismo.
            </p>
            <Link
              href="/"
              className="inline-block bg-electric-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-electric-700 transition"
            >
              Ir al Constructor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.map((build) => (
              <Link
                key={build.id}
                href={`/build/${build.id}`}
                className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-electric-300 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-electric-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 group-hover:bg-electric-100/50" />

                <div className="relative">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-electric-600 transition-colors mb-4 truncate pr-4">
                    {build.name}
                  </h3>

                  <div className="space-y-3 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-500" />
                      <span className="font-bold text-slate-700">
                        ${build.totalPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-slate-400" />
                      <span>{build._count.buildItems} Componentes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      <span>
                        {new Date(build.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-electric-600 font-bold text-xs uppercase tracking-wide group-hover:gap-2 transition-all">
                    Ver Detalles <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
