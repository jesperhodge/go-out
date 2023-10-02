-- DropForeignKey
ALTER TABLE "Gather" DROP CONSTRAINT "Gather_googlePlaceId_fkey";

-- AlterTable
ALTER TABLE "Gather" ALTER COLUMN "googlePlaceId" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GooglePlace" ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "place_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Gather" ADD CONSTRAINT "Gather_googlePlaceId_fkey" FOREIGN KEY ("googlePlaceId") REFERENCES "GooglePlace"("place_id") ON DELETE SET NULL ON UPDATE CASCADE;
