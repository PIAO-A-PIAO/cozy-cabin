/*
  Warnings:

  - A unique constraint covering the columns `[streetName,houseNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipientName` to the `Letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Letter" ADD COLUMN     "recipientName" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "houseNumber" INTEGER NOT NULL,
ADD COLUMN     "streetName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_streetName_houseNumber_key" ON "User"("streetName", "houseNumber");
