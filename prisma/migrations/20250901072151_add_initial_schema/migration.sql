-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('INACTIVE', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "defaultContributionAmount" DOUBLE PRECISION NOT NULL,
    "dueDate" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contributor" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contributionAmount" DOUBLE PRECISION NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentContribution" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "actualAmountPaid" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "proofOfPayment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "public"."Project"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_userId_title_key" ON "public"."Project"("userId", "title");

-- CreateIndex
CREATE INDEX "Contributor_projectId_idx" ON "public"."Contributor"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_projectId_name_key" ON "public"."Contributor"("projectId", "name");

-- CreateIndex
CREATE INDEX "PaymentContribution_projectId_idx" ON "public"."PaymentContribution"("projectId");

-- CreateIndex
CREATE INDEX "PaymentContribution_contributorId_idx" ON "public"."PaymentContribution"("contributorId");

-- AddForeignKey
ALTER TABLE "public"."Contributor" ADD CONSTRAINT "Contributor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentContribution" ADD CONSTRAINT "PaymentContribution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentContribution" ADD CONSTRAINT "PaymentContribution_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "public"."Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
