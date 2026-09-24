import {
  DEFAULT_ITEM_IMAGE,
  CATEGORY_IMAGES,
} from "@/constants/assets";

export interface PublicFoundItem {
  id: string;
  businessCode: string;
  jenis: { name: string };
  warna: { name: string };
  merek: { name: string };
  lokasi: { name: string };
  additionalDesc: string | null;
  createdAt: string;
}

export interface MasterFilterData {
  categories: { id: string; name: string }[];
  colors: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  locations: { id: string; name: string }[];
}

export { DEFAULT_ITEM_IMAGE, CATEGORY_IMAGES };

export const CATEGORY_ICONS: Record<string, string> = {
  Elektronik: "🎧",
  "Komputer & Aksesoris": "💻",
  "Handphone & Aksesoris": "📱",
  "Dompet & Uang": "👛",
  "Dokumen/Kertas": "📄",
  "Pakaian/Tas": "🎒",
  Tas: "🎒",
  Dompet: "👛",
  Jaket: "🧥",
  "Jas Hujan": "🌧️",
  Kemeja: "👔",
  Kaos: "👕",
  "Pakaian Olahraga": "🏃",
  Sepatu: "👟",
  "Jam Tangan": "⌚",
  "Botol & Tumbler": "🍶",
  "Perlengkapan Makan": "🍽️",
  Kacamata: "👓",
  "Perlengkapan Rumah": "🏠",
  Kunci: "🔑",
  Aksesoris: "💍",
  "Buku & Alat Tulis": "📚",
  Lainnya: "📦",
};

export function getCategoryRepresentativeImage(categoryName: string): string {
  if (CATEGORY_IMAGES[categoryName]) {
    return CATEGORY_IMAGES[categoryName];
  }
  const lower = categoryName.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_IMAGES)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return val;
    }
  }
  return DEFAULT_ITEM_IMAGE;
}

export function getCategoryIcon(categoryName: string): string {
  if (CATEGORY_ICONS[categoryName]) {
    return CATEGORY_ICONS[categoryName];
  }
  const lower = categoryName.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return val;
    }
  }
  return "🏷️";
}

export function getItemTitle(item: PublicFoundItem): string {
  if (!item.merek || item.merek.name === "Tanpa Merek") {
    return item.jenis.name;
  }
  return `${item.jenis.name} ${item.merek.name}`;
}

export function formatIndonesianDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function getItemLocalDateString(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}
