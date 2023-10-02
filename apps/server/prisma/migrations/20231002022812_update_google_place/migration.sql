/*
  Warnings:

  - You are about to drop the column `lat` on the `GooglePlace` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `GooglePlace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[location]` on the table `GooglePlace` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "GooglePlace_lat_lng_place_id_idx";

-- AlterTable
ALTER TABLE "GooglePlace" DROP COLUMN "lat",
DROP COLUMN "lng",
ADD COLUMN     "location" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GooglePlace_location_key" ON "GooglePlace"("location");

-- CreateIndex
CREATE INDEX "GooglePlace_location_place_id_idx" ON "GooglePlace"("location", "place_id");
