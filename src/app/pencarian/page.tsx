import { getPublicData } from "@/components/public/public-data";
import PublicSearchPortal from "@/components/public/PublicSearchPortal";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { items, masterData } = await getPublicData();
  const value = (key: string) => {
    const item = params[key];
    return Array.isArray(item) ? item[0] || "" : item || "";
  };

  return (
    <PublicSearchPortal
      initialItems={items}
      masterData={masterData}
      initialQuery={value("q")}
      initialSort={(value("sort") as "newest" | "oldest" | "name") || "newest"}
      initialCategory={value("category") || "all"}
      initialColor={value("color") || "all"}
      initialBrand={value("brand") || "all"}
      initialLocation={value("location") || "all"}
      initialFrom={value("from")}
      initialTo={value("to")}
    />
  );
}
