import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  let baseStyles = "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  let variantStyles = "";

  switch (variant) {
    case "primary":
      variantStyles = "bg-green-dark hover:bg-green-mid text-white";
      break;
    case "secondary":
      variantStyles = "bg-green-accent hover:bg-emerald-600 text-white";
      break;
    case "danger":
      variantStyles = "bg-red-500 hover:bg-red-600 text-white";
      break;
    case "outline":
      variantStyles = "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50";
      break;
    case "ghost":
      variantStyles = "bg-transparent text-gray-700 hover:bg-gray-50 shadow-none";
      break;
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
