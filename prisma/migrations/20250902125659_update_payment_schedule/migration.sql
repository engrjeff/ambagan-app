-- AlterTable
ALTER TABLE "public"."PaymentSchedule" ALTER COLUMN "actualAmountPaid" SET DEFAULT 0,
ALTER COLUMN "paymentDate" DROP NOT NULL,
ALTER COLUMN "paymentMethod" SET DEFAULT 'UNPAID';
