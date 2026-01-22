"use client";
import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  label?: string;
  variant?: "primary" | "secondary";
}

const PushButton = ({
  children,
  label,
  variant = "primary",
  ...props
}: Props) => {
  const isPrimary = variant === "primary";

  return (
    <button
      {...props}
      className={`relative border-none bg-transparent p-0 cursor-pointer outline-none transition-filter duration-200 hover:brightness-110 group select-none touch-manipulation focus:outline-none ${props.className || ""}`}
    >
      {/* Shadow */}
      <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-slate-900/20 blur-[2px] translate-y-[2px] transition-transform duration-600 cubic-bezier(0.3, 0.7, 0.4, 1) group-hover:translate-y-[4px] group-hover:duration-200 group-active:translate-y-px group-active:duration-75" />

      {/* Edge (Depth) */}
      <span
        className={`absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-r ${
          isPrimary
            ? "from-blue-800 via-blue-700 to-blue-800"
            : "from-slate-400 via-slate-300 to-slate-400"
        }`}
      />

      {/* Front (Face) */}
      <span
        className={`block relative rounded-lg px-5 py-2 font-bold uppercase tracking-wider text-[10px] sm:text-xs -translate-y-[4px] transition-transform duration-600 cubic-bezier(0.3, 0.7, 0.4, 1) group-hover:-translate-y-[6px] group-hover:duration-200 group-active:-translate-y-[2px] group-active:duration-75 ${
          isPrimary
            ? "bg-electric-600 text-white"
            : "bg-slate-200 text-slate-700"
        }`}
      >
        {label || children}
      </span>
    </button>
  );
};

export default PushButton;
