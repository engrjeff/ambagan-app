/*
  Warnings:

  - You are about to drop the column `modeOfPayment` on the `PaymentContribution` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `PaymentContribution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'GCASH', 'BANK_TRANSFER');

-- AlterTable
ALTER TABLE "public"."PaymentContribution" DROP COLUMN "modeOfPayment",
ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL;

-- DropEnum
DROP TYPE "public"."ModeOfPayment";
