/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "contactPreference" TEXT DEFAULT 'email',
ADD COLUMN     "documentNumber" TEXT,
ADD COLUMN     "documentType" TEXT DEFAULT 'DNI',
ADD COLUMN     "taxId" TEXT;
