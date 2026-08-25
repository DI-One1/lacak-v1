import { Suspense } from "react";
import AccessDeniedContent from "./AccessDeniedContent";

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Memuat...</p>
      </div>
    }>
      <AccessDeniedContent />
    </Suspense>
  );
}