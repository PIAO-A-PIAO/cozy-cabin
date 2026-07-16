-- DropForeignKey
ALTER TABLE "Letter" DROP CONSTRAINT "Letter_recipientId_fkey";

-- AlterTable
ALTER TABLE "Letter" ALTER COLUMN "recipientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
