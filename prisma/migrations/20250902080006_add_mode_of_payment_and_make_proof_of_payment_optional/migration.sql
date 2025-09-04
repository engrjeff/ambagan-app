/*
  Warnings:

  - Added the required column `modeOfPayment` to the `PaymentContribution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ModeOfPayment" AS ENUM ('CASH', 'GCASH', 'BANK_TRANSFER');

-- AlterTable
ALTER TABLE "public"."PaymentContribution" ADD COLUMN     "modeOfPayment" "public"."ModeOfPayment" NOT NULL,
ALTER COLUMN "proofOfPayment" DROP NOT NULL;
