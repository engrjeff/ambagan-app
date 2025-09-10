"use server";

import { prisma } from "@/lib/prisma";

interface GetContributorDetailArgs {
  contributorId: string;
}

export async function getContributorDetail(args: GetContributorDetailArgs) {
  const { contributorId } = args;

  const contributor = await prisma.contributor.findUnique({
    where: { id: contributorId },
    include: {
      project: { select: { id: true, title: true } },
      paymentSchedules: {
        orderBy: {
          scheduledPaymentDate: "asc",
        },
      },
    },
  });

  return contributor;
}
