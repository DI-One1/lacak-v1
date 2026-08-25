import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

// 📧 Email khusus yang dijadikan PETUGAS utama
const ADMIN_EMAIL = "mochcomeback@gmail.com";

export async function syncUserToDatabase() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
    const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User Tanpa Nama";

    // Otomatis tentukan role berdasarkan email login
    const userRole = primaryEmail === ADMIN_EMAIL ? "PETUGAS" : "USER";

    const user = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: {
        name: fullName,
        email: primaryEmail,
        imageUrl: clerkUser.imageUrl,
        role: userRole,
      },
      create: {
        clerkId: clerkUser.id,
        name: fullName,
        email: primaryEmail,
        imageUrl: clerkUser.imageUrl,
        role: userRole,
      },
    });

    return user;
  } catch (error) {
    console.error("Gagal melakukan sinkronisasi user:", error);
    return null;
  }
}