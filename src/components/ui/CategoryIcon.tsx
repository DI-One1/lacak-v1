import React from "react";
import {
  Headphones,
  Laptop,
  Smartphone,
  Wallet,
  FileText,
  ShoppingBag,
  Backpack,
  Shirt,
  CloudRain,
  Activity,
  Footprints,
  Watch,
  CupSoda,
  Utensils,
  Glasses,
  Home,
  Key,
  Sparkles,
  BookOpen,
  Package,
  Tag,
  LucideProps,
} from "lucide-react";

interface CategoryIconProps extends LucideProps {
  categoryName: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({
  categoryName,
  size = 20,
  className = "",
  ...props
}: CategoryIconProps) {
  const nameLower = (categoryName || "").toLowerCase().trim();

  let IconComponent = Tag;

  if (nameLower.includes("elektronik")) {
    IconComponent = Headphones;
  } else if (nameLower.includes("komputer") || nameLower.includes("laptop")) {
    IconComponent = Laptop;
  } else if (nameLower.includes("handphone") || nameLower.includes("hp") || nameLower.includes("ponsel")) {
    IconComponent = Smartphone;
  } else if (nameLower.includes("dompet") || nameLower.includes("uang")) {
    IconComponent = Wallet;
  } else if (nameLower.includes("dokumen") || nameLower.includes("kertas") || nameLower.includes("surat")) {
    IconComponent = FileText;
  } else if (nameLower.includes("tas") || nameLower.includes("ransel")) {
    IconComponent = Backpack;
  } else if (nameLower.includes("jaket") || nameLower.includes("kemeja") || nameLower.includes("kaos") || nameLower.includes("pakaian")) {
    IconComponent = Shirt;
  } else if (nameLower.includes("hujan") || nameLower.includes("jas hujan")) {
    IconComponent = CloudRain;
  } else if (nameLower.includes("olahraga")) {
    IconComponent = Activity;
  } else if (nameLower.includes("sepatu") || nameLower.includes("sandal")) {
    IconComponent = Footprints;
  } else if (nameLower.includes("jam")) {
    IconComponent = Watch;
  } else if (nameLower.includes("botol") || nameLower.includes("tumbler") || nameLower.includes("minum")) {
    IconComponent = CupSoda;
  } else if (nameLower.includes("makan") || nameLower.includes("alat makan")) {
    IconComponent = Utensils;
  } else if (nameLower.includes("kacamata")) {
    IconComponent = Glasses;
  } else if (nameLower.includes("rumah")) {
    IconComponent = Home;
  } else if (nameLower.includes("kunci")) {
    IconComponent = Key;
  } else if (nameLower.includes("aksesoris") || nameLower.includes("perhiasan")) {
    IconComponent = Sparkles;
  } else if (nameLower.includes("buku") || nameLower.includes("tulis")) {
    IconComponent = BookOpen;
  } else if (nameLower.includes("lain")) {
    IconComponent = Package;
  }

  return <IconComponent size={size} className={className} strokeWidth={2} {...props} />;
}

export default CategoryIcon;
