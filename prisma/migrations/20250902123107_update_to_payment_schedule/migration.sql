/*
  Warnings:

  - You are about to drop the `PaymentContribution` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."PaymentMethod" ADD VALUE 'UNPAID';

-- DropForeignKey
ALTER TABLE "public"."PaymentContribution" DROP CONSTRAINT "PaymentContribution_contributorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentContribution" DROP CONSTRAINT "PaymentContribution_projectId_fkey";

-- DropTable
DROP TABLE "public"."PaymentContribution";

-- CreateTable
CREATE TABLE "public"."PaymentSchedule" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "actualAmountPaid" DOUBLE PRECISION NOT NULL,
    "amountToPay" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "scheduledPaymentDate" TIMESTAMP(3) NOT NULL,
    "proofOfPayment" TEXT,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentSchedule_projectId_idx" ON "public"."PaymentSchedule"("projectId");

-- CreateIndex
CREATE INDEX "PaymentSchedule_contributorId_idx" ON "public"."PaymentSchedule"("contributorId");

-- AddForeignKey
ALTER TABLE "public"."PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "public"."Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
