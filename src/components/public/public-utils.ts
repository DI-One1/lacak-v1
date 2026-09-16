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

export const DEFAULT_ITEM_IMAGE =
  "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80";

export const CATEGORY_IMAGES: Record<string, string> = {
  Elektronik:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  "Komputer & Aksesoris":
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
  "Handphone & Aksesoris":
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80",
  Jaket:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
  "Jas Hujan":
    "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80",
  Kemeja:
    "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=600&q=80",
  Kaos:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
  "Pakaian Olahraga":
    "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80",
  Sepatu:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  Tas:
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  Dompet:
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
  "Dompet & Uang":
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
  "Jam Tangan":
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  Aksesoris:
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80",
  "Buku & Alat Tulis":
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80",
  "Botol & Tumbler":
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
  "Perlengkapan Makan":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
  Kacamata:
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
  "Perlengkapan Rumah":
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
  Kunci:
    "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80",
  Lainnya:
    "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80",
};

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
