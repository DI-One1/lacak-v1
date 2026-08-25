"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Tipe untuk notifikasi yang sudah diserialisasi (createdAt menjadi string)
export type SerializedNotification = {
  id: string;
  wargaId: string | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string; // <-- string ISO
};

/**
 * Ambil notifikasi terbaru (urut dari yang paling baru)
 * Hasil dikonversi ke format serializable (createdAt -> string)
 */
export async function getNotifications(limit = 20): Promise<SerializedNotification[]> {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    // Konversi Date ke string ISO
    return notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Gagal mengambil notifikasi:", error);
    return [];
  }
}

/**
 * Tandai semua notifikasi sebagai sudah dibaca
 */
export async function markAllAsRead() {
  try {
    await prisma.notification.updateMany({
      data: { isRead: true },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menandai semua notifikasi:", error);
    return { success: false };
  }
}

/**
 * Hitung jumlah notifikasi yang belum dibaca
 */
export async function getUnreadCount() {
  try {
    const count = await prisma.notification.count({
      where: { isRead: false },
    });
    return count;
  } catch (error) {
    console.error("Gagal menghitung notifikasi belum dibaca:", error);
    return 0;
  }
}

/**
 * Tandai satu notifikasi sebagai sudah dibaca
 */
export async function markOneAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menandai notifikasi:", error);
    return { success: false };
  }
}