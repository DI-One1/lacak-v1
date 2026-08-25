import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const items = await prisma.foundItem.findMany({
    where: { status: "FOUND" },
    include: { jenis: true, warna: true, merek: true, lokasi: true },
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 20),
  });

  // Serialize tanggal menjadi string
  const serialized = items.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  return NextResponse.json(serialized);
}