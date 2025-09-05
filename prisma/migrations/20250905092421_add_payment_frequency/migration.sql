/*
  Warnings:

  - Added the required column `paymentFrequency` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentFrequency" AS ENUM ('ONE_TIME', 'WEEKLY', 'MONTHLY', 'QUARTERLY');

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "paymentFrequency" "public"."PaymentFrequency" NOT NULL;
