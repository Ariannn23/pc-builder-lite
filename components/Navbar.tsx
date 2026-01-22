import Link from "next/link";
import Logo from "./Logo";
import PushButton from "./PushButton";
import { Session } from "next-auth";
import UserMenu from "./UserMenu";
import MobileNav from "./MobileNav";

interface Props {
  session: Session | null;
}

export default function Navbar({ session }: Props) {
  return (
    <nav className="absolute top-0 w-full flex items-center justify-between px-4 py-4 md:px-12 md:py-6 z-50 pointer-events-none">
      {/* pointer-events-auto para que los botones funcionen dentro de un contenedor transparente */}
      <div className="pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform duration-300" />
          <h1 className="text-lg md:text-2xl font-extrabold tracking-tight text-slate-800">
            PC Builder{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">
              Lite
            </span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-6 pointer-events-auto">
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <PushButton label="Iniciar Sesión" variant="secondary" />
              </Link>
              <Link href="/register">
                <PushButton label="Registrarse" variant="primary" />
              </Link>
            </div>
            <div className="md:hidden">
              <MobileNav />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
