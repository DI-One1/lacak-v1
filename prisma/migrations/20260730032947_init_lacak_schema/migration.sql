-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('FOUND', 'CLAIMED', 'EXPIRED');

-- CreateTable
CREATE TABLE "category_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "color_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "color_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lost_reports" (
    "id" TEXT NOT NULL,
    "reporter_name" TEXT NOT NULL,
    "reporter_id_card" TEXT NOT NULL,
    "reporter_contact" TEXT NOT NULL,
    "jenis_id" TEXT NOT NULL,
    "warna_id" TEXT NOT NULL,
    "merek_id" TEXT NOT NULL,
    "lokasi_id" TEXT NOT NULL,
    "additional_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lost_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "found_items" (
    "id" TEXT NOT NULL,
    "business_code" TEXT NOT NULL,
    "finder_name" TEXT NOT NULL,
    "jenis_id" TEXT NOT NULL,
    "warna_id" TEXT NOT NULL,
    "merek_id" TEXT NOT NULL,
    "lokasi_id" TEXT NOT NULL,
    "additional_desc" TEXT,
    "status" "ItemStatus" NOT NULL DEFAULT 'FOUND',
    "active_days_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "found_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_transactions" (
    "id" TEXT NOT NULL,
    "found_item_id" TEXT NOT NULL,
    "claimant_name" TEXT NOT NULL,
    "claimant_id_card" TEXT NOT NULL,
    "claimant_contact" TEXT NOT NULL,
    "handled_by" TEXT NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_calendar" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "is_holiday" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "academic_calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_items_name_key" ON "category_items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "color_items_name_key" ON "color_items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brand_items_name_key" ON "brand_items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "location_items_name_key" ON "location_items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "found_items_business_code_key" ON "found_items"("business_code");

-- CreateIndex
CREATE UNIQUE INDEX "claim_transactions_found_item_id_key" ON "claim_transactions"("found_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_calendar_date_key" ON "academic_calendar"("date");

-- AddForeignKey
ALTER TABLE "lost_reports" ADD CONSTRAINT "lost_reports_jenis_id_fkey" FOREIGN KEY ("jenis_id") REFERENCES "category_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lost_reports" ADD CONSTRAINT "lost_reports_warna_id_fkey" FOREIGN KEY ("warna_id") REFERENCES "color_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lost_reports" ADD CONSTRAINT "lost_reports_merek_id_fkey" FOREIGN KEY ("merek_id") REFERENCES "brand_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lost_reports" ADD CONSTRAINT "lost_reports_lokasi_id_fkey" FOREIGN KEY ("lokasi_id") REFERENCES "location_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "found_items" ADD CONSTRAINT "found_items_jenis_id_fkey" FOREIGN KEY ("jenis_id") REFERENCES "category_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "found_items" ADD CONSTRAINT "found_items_warna_id_fkey" FOREIGN KEY ("warna_id") REFERENCES "color_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "found_items" ADD CONSTRAINT "found_items_merek_id_fkey" FOREIGN KEY ("merek_id") REFERENCES "brand_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "found_items" ADD CONSTRAINT "found_items_lokasi_id_fkey" FOREIGN KEY ("lokasi_id") REFERENCES "location_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_transactions" ADD CONSTRAINT "claim_transactions_found_item_id_fkey" FOREIGN KEY ("found_item_id") REFERENCES "found_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
