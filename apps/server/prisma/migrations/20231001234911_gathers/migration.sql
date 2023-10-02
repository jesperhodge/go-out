-- CreateTable
CREATE TABLE "Gather" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "location" TEXT,
    "date" TIMESTAMP(3),

    CONSTRAINT "Gather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GatherToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GatherToUser_AB_unique" ON "_GatherToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GatherToUser_B_index" ON "_GatherToUser"("B");

-- AddForeignKey
ALTER TABLE "_GatherToUser" ADD CONSTRAINT "_GatherToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Gather"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GatherToUser" ADD CONSTRAINT "_GatherToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
