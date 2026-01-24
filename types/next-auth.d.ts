import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      username?: string | null;
      documentType?: string | null;
      documentNumber?: string | null;
      // Agrega aquí otros campos si los necesitas en la sesión
    } & DefaultSession["user"];
  }

  interface User {
    username?: string | null;
    documentType?: string | null;
    documentNumber?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string | null;
  }
}
