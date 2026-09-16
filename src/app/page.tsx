import PublicPortal from "@/components/public/PublicPortal";
import { getPublicData } from "@/components/public/public-data";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const { items, masterData } = await getPublicData();


  return (
    <div className="min-h-screen bg-[#fafcfb]">
      <PublicPortal initialItems={items} masterData={masterData} />
    </div>
  );
}
