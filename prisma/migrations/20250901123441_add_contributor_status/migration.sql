-- CreateEnum
CREATE TYPE "public"."ContributorStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "public"."Contributor" ADD COLUMN     "status" "public"."ContributorStatus" NOT NULL DEFAULT 'ACTIVE';
