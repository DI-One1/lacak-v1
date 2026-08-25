/*
  Warnings:

  - The values [EXPIRED] on the enum `ItemStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `handled_by` on the `claim_transactions` table. All the data in the column will be lost.
  - Added the required column `finder_contact` to the `found_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PETUGAS', 'USER');

-- AlterEnum
BEGIN;
CREATE TYPE "ItemStatus_new" AS ENUM ('FOUND', 'CLAIMED');
ALTER TABLE "public"."found_items" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "found_items" ALTER COLUMN "status" TYPE "ItemStatus_new" USING ("status"::text::"ItemStatus_new");
ALTER TYPE "ItemStatus" RENAME TO "ItemStatus_old";
ALTER TYPE "ItemStatus_new" RENAME TO "ItemStatus";
DROP TYPE "public"."ItemStatus_old";
ALTER TABLE "found_items" ALTER COLUMN "status" SET DEFAULT 'FOUND';
COMMIT;

-- AlterTable
ALTER TABLE "claim_transactions" DROP COLUMN "handled_by",
ADD COLUMN     "handled_by_id" TEXT;

-- AlterTable
ALTER TABLE "found_items" ADD COLUMN     "finder_contact" TEXT NOT NULL,
ADD COLUMN     "finder_id_card" TEXT NOT NULL DEFAULT '-',
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "lost_reports" ADD COLUMN     "user_id" TEXT;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warga" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "peran" TEXT NOT NULL,
    "keterangan_peran" TEXT,
    "nomor_telepon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "lost_reports" ADD CONSTRAINT "lost_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "found_items" ADD CONSTRAINT "found_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_transactions" ADD CONSTRAINT "claim_transactions_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
