import { auth } from "@/auth";

export default auth((req) => {
  // Aquí podemos proteger rutas. Por ahora, solo inicializa la sesión.
});

// Opcional: No invocar middleware en archivos estáticos
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
