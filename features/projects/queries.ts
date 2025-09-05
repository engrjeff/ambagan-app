'use server';

import { PaymentMethod, PaymentSchedule } from '@/app/generated/prisma';
import { prisma } from '@/lib/prisma';
import { formatDate, removeDuplicates } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';

function getTotalContributions(paymentContributions: PaymentSchedule[]) {
  return paymentContributions.reduce(
    (total, payment) => total + payment.actualAmountPaid,
    0
  );
}

export async function getProjects() {
  const user = await auth();

  if (!user?.userId) throw new Error('Session not found');

  const projects = await prisma.project.findMany({
    where: { userId: user.userId },
    include: { paymentSchedules: true },
  });

  const mappedProjects = projects.map((p) => {
    const totalContributions = getTotalContributions(p.paymentSchedules);

    const percentage = (totalContributions / p.targetAmount) * 100;

    return {
      ...p,
      totalAmountPaid: totalContributions,
      percentage,
    };
  });

  return {
    projects: mappedProjects,
  };
}

interface GetProjectByIdArgs {
  projectId: string;
  c?: string; // contributor name search
  date?: string; // schedule
  sort?: string;
  order?: 'asc' | 'desc';
}

function getContributorSort(sortBy?: string, order?: 'asc' | 'desc') {
  const acceptedSortKeys = ['name', 'contributionAmount'];

  if (sortBy && !acceptedSortKeys.includes(sortBy))
    return { name: 'asc' as 'asc' | 'desc' };

  let sortByValue = sortBy ? sortBy : 'name';
  let sortOrderValue = order ? order : 'asc';

  return {
    [sortByValue]: sortOrderValue,
  };
}

function getPaymentScheduleSort(sortBy?: string, order?: 'asc' | 'desc') {
  if (!sortBy && !order)
    return {
      contributor: {
        name: 'asc' as 'asc' | 'desc',
      },
    };

  if (sortBy === 'paidBy')
    return {
      contributor: {
        name: order ?? 'asc',
      },
    };

  const acceptedSortKeys = ['actualAmountPaid', 'paymentMethod', 'paymentDate'];

  if (sortBy && !acceptedSortKeys.includes(sortBy))
    return {
      contributor: {
        name: order ?? 'asc',
      },
    };

  let sortByValue = sortBy ? sortBy : 'name';
  let sortOrderValue = order ? order : 'asc';

  return {
    [sortByValue]: sortOrderValue,
  };
}

export async function getProjectById({
  projectId,
  c,
  date,
  sort,
  order,
}: GetProjectByIdArgs) {
  // for payment schedule options
  const paymentSchedules = await prisma.paymentSchedule.findMany({
    where: { projectId },
    include: {
      contributor: { select: { name: true, contributionAmount: true } },
    },
    orderBy: {
      scheduledPaymentDate: 'asc',
    },
  });

  const defaultScheduleDateFilter = paymentSchedules.at(0);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      paymentSchedules: {
        where: {
          scheduledPaymentDate: date
            ? {
                equals: new Date(date),
              }
            : {
                equals: defaultScheduleDateFilter?.scheduledPaymentDate,
              },

          contributor: {
            name: {
              contains: c,
              mode: 'insensitive',
            },
          },
        },
        include: {
          contributor: true,
        },
        orderBy: getPaymentScheduleSort(sort, order),
      },
      contributors: {
        where: {
          name: {
            contains: c,
            mode: 'insensitive',
          },
        },
        include: {
          paymentSchedules: {
            orderBy: {
              paymentDate: 'asc',
            },
          },
        },
        orderBy: getContributorSort(sort, order),
      },
    },
  });

  // quick statistics data
  const totalRaised = paymentSchedules.reduce(
    (total, payment) => total + payment.actualAmountPaid,
    0
  );

  const contributionsThisMonth =
    project?.paymentSchedules.reduce(
      (total, payment) => total + payment.actualAmountPaid,
      0
    ) ?? 0;

  const paidContributorsCount =
    project?.paymentSchedules.filter(
      (p) => p.paymentMethod !== PaymentMethod.UNPAID
    )?.length ?? 0;

  const quickStatistics = {
    totalRaised,
    targetAmount: project?.targetAmount ?? 0,
    contributionsThisMonth,
    paidContributorsCount,
    contributorsCount: project?.contributors.length ?? 0,
  };

  // top contributors
  const paidSchedules = paymentSchedules.filter(
    (p) => p.paymentMethod !== PaymentMethod.UNPAID
  );
  // group by contributor
  const topContributorsMap = new Map<
    string,
    { id: string; name: string; totalPaid: number; contributionAmount: number }
  >();

  paidSchedules.forEach((ps) => {
    const contributor = topContributorsMap.get(ps.contributorId);

    if (contributor) {
      topContributorsMap.set(ps.contributorId, {
        id: ps.contributorId,
        name: ps.contributor.name,
        totalPaid: contributor.totalPaid + ps.actualAmountPaid,
        contributionAmount: ps.contributor.contributionAmount,
      });
    } else {
      topContributorsMap.set(ps.contributorId, {
        id: ps.contributorId,
        name: ps.contributor.name,
        totalPaid: ps.actualAmountPaid,
        contributionAmount: ps.contributor.contributionAmount,
      });
    }
  });

  const paymentDateOptions = paymentSchedules.map((p) => ({
    id: p.id,
    value: p.scheduledPaymentDate.toISOString(),
    label: formatDate(p.scheduledPaymentDate.toISOString()),
  }));

  return {
    project,
    quickStatistics,
    paymentDateOptions: removeDuplicates(paymentDateOptions, 'label'),
    topContributors: Array.from(topContributorsMap.values()).sort((a, b) =>
      a.totalPaid < b.totalPaid ? 1 : -1
    ),
  };
}
