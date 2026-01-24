"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginSchema } from "@/lib/zod";
import { useState, useTransition } from "react";
import { login } from "@/app/auth-actions";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  callbackUrl?: string;
}

export const LoginForm = ({ callbackUrl }: LoginFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    startTransition(() => {
      login(values, callbackUrl).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
      });
    });
  };

  return (
    <div className="relative flex w-full max-w-sm flex-col rounded-xl bg-white bg-clip-border text-slate-700 shadow-md">
      <div className="relative mx-4 -mt-6 mb-4 grid place-items-center overflow-hidden rounded-xl bg-linear-to-tr from-electric-600 to-blue-400 bg-clip-border text-white shadow-lg shadow-blue-500/40 py-8 px-4 text-center">
        <h3 className="block font-sans text-3xl font-semibold leading-snug tracking-normal text-white antialiased">
          Bienvenido
        </h3>
        <p className="text-blue-100 mt-2 text-sm font-light">
          Ingresa a tu cuenta para guardar tus builds
        </p>
      </div>
      <div className="flex flex-col gap-4 p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              {...form.register("email")}
              type="email"
              placeholder=""
              disabled={isPending}
              className="peer h-full w-full rounded-md border border-slate-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-slate-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-slate-200 placeholder-shown:border-t-slate-200 focus:border-2 focus:border-electric-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-slate-50"
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-slate-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-slate-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-slate-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-slate-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-electric-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-electric-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-electric-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-slate-500">
              Correo Electrónico
            </label>
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1 absolute -bottom-5">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="relative h-11 w-full min-w-[200px]">
            <input
              {...form.register("password")}
              type="password"
              placeholder=""
              disabled={isPending}
              className="peer h-full w-full rounded-md border border-slate-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-slate-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-slate-200 placeholder-shown:border-t-slate-200 focus:border-2 focus:border-electric-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-slate-50"
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-slate-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-slate-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-slate-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-slate-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-electric-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-electric-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-electric-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-slate-500">
              Contraseña
            </label>
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1 absolute -bottom-5">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="block w-full select-none rounded-lg bg-linear-to-tr from-electric-600 to-blue-400 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 active:scale-[0.98] active:ring-2 active:ring-electric-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none flex items-center justify-center cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="mt-4 flex justify-center font-sans text-sm font-light leading-normal text-inherit antialiased">
          <p>¿No tienes cuenta?</p>
          <Link
            href={
              callbackUrl
                ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/register"
            }
            className="ml-1 block font-sans text-sm font-bold leading-normal text-electric-600 antialiased hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};
