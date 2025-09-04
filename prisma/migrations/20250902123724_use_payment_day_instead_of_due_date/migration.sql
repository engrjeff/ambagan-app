/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Project` table. All the data in the column will be lost.
  - Added the required column `paymentDay` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "dueDate",
ADD COLUMN     "paymentDay" INTEGER NOT NULL;
