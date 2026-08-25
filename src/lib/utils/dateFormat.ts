/**
 * Format tanggal menjadi string relatif dalam Bahasa Indonesia.
 * Dipakai bersama oleh komponen carousel dan notification dropdown.
 *
 * Contoh output:
 *   - "Baru saja" (< 1 menit)
 *   - "5 menit lalu"
 *   - "2 jam lalu"
 *   - "3 hari lalu"
 *   - "15/03/2025" (> 7 hari)
 */
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return past.toLocaleDateString("id-ID");
}
