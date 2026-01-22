import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/40 rounded-full blur-3xl animate-pulse mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/40 rounded-full blur-3xl animate-pulse delay-700 mix-blend-multiply" />
      <div className="absolute top-[40%] left-[40%] w-64 h-64 bg-electric-500/20 rounded-full blur-3xl animate-pulse delay-1000 mix-blend-multiply" />

      <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
        <LoginForm />
      </div>
    </div>
  );
}
