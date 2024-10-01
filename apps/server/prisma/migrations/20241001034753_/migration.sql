/*
  Warnings:

  - A unique constraint covering the columns `[clerk_uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerk_uuid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerk_uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_uuid_key" ON "User"("clerk_uuid");
