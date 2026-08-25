"use server";

import { prisma } from "@/lib/prisma";

/**
 * Checks all FoundItems with status "FOUND" and marks them as "EXPIRED"
 * if they were created more than 30 days ago.
 */
export async function checkAndExpireItems() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const result = await prisma.foundItem.updateMany({
      where: {
        status: "FOUND",
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    if (result.count > 0) {
      console.log(`[checkAndExpireItems] Lazily expired ${result.count} FoundItem(s).`);
    }
  } catch (error) {
    console.error("[checkAndExpireItems] Error updating expired items:", error);
  }
}
