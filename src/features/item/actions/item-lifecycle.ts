"use server";

import { prisma } from "@/lib/prisma";

/**
 * Checks all FoundItems with status "FOUND" and marks them as "EXPIRED"
 * if they were created more than 30 days ago.
 *
 * This function should ONLY be called inside mutative write operations
 * (createFoundItem, createLostReport, processClaimItem) — never inside
 * read-only queries. Placing it in read paths causes unnecessary write-on-read
 * latency spikes.
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
