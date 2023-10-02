/*
  Warnings:

  - Added the required column `googlePlaceId` to the `Gather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Gather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gather" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "googlePlaceId" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "GooglePlace" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "place_id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "name" TEXT,
    "opening_hours" JSONB,
    "formatted_address" TEXT,
    "formatted_phone_number" TEXT,
    "photos" JSONB,
    "rating" DOUBLE PRECISION,
    "reviews" JSONB,
    "types" JSONB,
    "url" TEXT,
    "user_ratings_total" INTEGER,
    "website" TEXT,

    CONSTRAINT "GooglePlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GooglePlace_place_id_key" ON "GooglePlace"("place_id");

-- CreateIndex
CREATE INDEX "GooglePlace_lat_lng_place_id_idx" ON "GooglePlace"("lat", "lng", "place_id");

-- CreateIndex
CREATE INDEX "Gather_googlePlaceId_idx" ON "Gather"("googlePlaceId");

-- AddForeignKey
ALTER TABLE "Gather" ADD CONSTRAINT "Gather_googlePlaceId_fkey" FOREIGN KEY ("googlePlaceId") REFERENCES "GooglePlace"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;
