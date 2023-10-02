/*
  Warnings:

  - You are about to drop the `_GatherToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Gather` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GatherToUser" DROP CONSTRAINT "_GatherToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GatherToUser" DROP CONSTRAINT "_GatherToUser_B_fkey";

-- AlterTable
ALTER TABLE "Gather" ADD COLUMN     "creatorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_GatherToUser";

-- CreateTable
CREATE TABLE "_Gather_participantsToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Gather_participantsToUsers_AB_unique" ON "_Gather_participantsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_Gather_participantsToUsers_B_index" ON "_Gather_participantsToUsers"("B");

-- AddForeignKey
ALTER TABLE "Gather" ADD CONSTRAINT "Gather_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Gather_participantsToUsers" ADD CONSTRAINT "_Gather_participantsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Gather"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Gather_participantsToUsers" ADD CONSTRAINT "_Gather_participantsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
