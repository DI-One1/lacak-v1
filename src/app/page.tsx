import { prisma } from "@/lib/prisma";
import CarouselFoundItems from "@/components/CarouselFoundItems";
import type { PublicFoundItem } from "@/components/CarouselFoundItems";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  /* ── Fetch real found items (public-safe fields only) ── */
  const raw = await prisma.foundItem.findMany({
    where: { status: "FOUND" },
    select: {
      id: true,
      jenis: { select: { name: true } },
      warna: { select: { name: true } },
      merek: { select: { name: true } },
      lokasi: { select: { name: true } },
      additionalDesc: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  /* Serialize dates for client component */
  const items: PublicFoundItem[] = raw.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-[50vh]">
      <CarouselFoundItems items={items} />
    </div>
  );
}
