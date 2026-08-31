import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  let colorStyles = "";
  switch (variant) {
    case "success":
      colorStyles = "bg-emerald-50 text-emerald-700 border border-emerald-200";
      break;
    case "warning":
      colorStyles = "bg-amber-50 text-amber-700 border border-amber-200";
      break;
    case "danger":
      colorStyles = "bg-red-50 text-red-700 border border-red-200";
      break;
    case "info":
      colorStyles = "bg-blue-50 text-blue-700 border border-blue-200";
      break;
    case "neutral":
      colorStyles = "bg-gray-50 text-gray-600 border border-gray-200";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorStyles} ${className}`}>
      {children}
    </span>
  );
}
