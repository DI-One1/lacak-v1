import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tambahkan baris ini agar Turbopack mengenali modul runtime Prisma di luar node_modules
  transpilePackages: ["@prisma/client", "@prisma/client-runtime-utils"],
};

export default nextConfig;