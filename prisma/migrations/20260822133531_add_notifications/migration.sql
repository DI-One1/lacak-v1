/*
  Warnings:

  - You are about to drop the column `handled_by_id` on the `claim_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `found_items` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `lost_reports` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LostStatus" AS ENUM ('DICARI', 'SELESAI');

-- DropForeignKey
ALTER TABLE "claim_transactions" DROP CONSTRAINT "claim_transactions_handled_by_id_fkey";

-- DropForeignKey
ALTER TABLE "found_items" DROP CONSTRAINT "found_items_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lost_reports" DROP CONSTRAINT "lost_reports_user_id_fkey";

-- AlterTable
ALTER TABLE "claim_transactions" DROP COLUMN "handled_by_id",
ADD COLUMN     "warga_id" TEXT;

-- AlterTable
ALTER TABLE "found_items" DROP COLUMN "user_id",
ADD COLUMN     "warga_id" TEXT;

-- AlterTable
ALTER TABLE "lost_reports" DROP COLUMN "user_id",
ADD COLUMN     "status" "LostStatus" NOT NULL DEFAULT 'DICARI',
ADD COLUMN     "warga_id" TEXT;

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "warga_id" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lost_reports" ADD CONSTRAINT "lost_reports_warga_id_fkey" FOREIGN KEY ("warga_id") REFERENCES "warga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "found_items" ADD CONSTRAINT "found_items_warga_id_fkey" FOREIGN KEY ("warga_id") REFERENCES "warga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_transactions" ADD CONSTRAINT "claim_transactions_warga_id_fkey" FOREIGN KEY ("warga_id") REFERENCES "warga"("id") ON DELETE SET NULL ON UPDATE CASCADE;
