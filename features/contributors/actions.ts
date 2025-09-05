'use server';

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/safe-action';
import {
  addDays,
  addMonths,
  addQuarters,
  getDaysInMonth,
  isBefore,
  isSameDay,
  isWithinInterval,
  setDate,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { PaymentFrequency } from '@/app/generated/prisma';
import { revalidatePath } from 'next/cache';
import {
  contributorEditSchema,
  contributorIdSchema,
  contributorSchema,
} from './schema';

/* Gets the appropriate payment date for a specific month, handling edge cases
 */
function getPaymentDateForMonth(monthDate: Date, paymentDay: number): Date {
  const daysInMonth = getDaysInMonth(monthDate);

  // If the payment day exceeds the days in the month, use the last day
  const actualPaymentDay = Math.min(paymentDay, daysInMonth);

  return setDate(monthDate, actualPaymentDay);
}

/**
 * Generates all payment dates between start and end dates based on payment frequency
 */
function generatePaymentDates(
  startDate: Date,
  endDate: Date,
  paymentDay: number,
  paymentFrequency: PaymentFrequency
): Date[] {
  const paymentDates: Date[] = [];

  switch (paymentFrequency) {
    case PaymentFrequency.ONE_TIME: {
      // For one-time payments, use the start date
      paymentDates.push(startDate);
      break;
    }

    case PaymentFrequency.WEEKLY: {
      // Start from the first occurrence of the payment day in the start week
      let currentDate = startOfWeek(startDate);
      currentDate = addDays(currentDate, paymentDay % 7);
      
      // If the calculated date is before start date, move to next week
      if (isBefore(currentDate, startDate)) {
        currentDate = addDays(currentDate, 7);
      }

      while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
        if (isWithinInterval(currentDate, { start: startDate, end: endDate })) {
          paymentDates.push(new Date(currentDate));
        }
        currentDate = addDays(currentDate, 7);
      }
      break;
    }

    case PaymentFrequency.MONTHLY: {
      // Start from the beginning of the month containing startDate
      let currentMonth = startOfMonth(startDate);

      while (isBefore(currentMonth, endDate) || isSameDay(currentMonth, endDate)) {
        const paymentDate = getPaymentDateForMonth(currentMonth, paymentDay);

        // Only include payment dates that fall within the project period
        if (isWithinInterval(paymentDate, { start: startDate, end: endDate })) {
          paymentDates.push(paymentDate);
        }

        // Move to next month
        currentMonth = addMonths(currentMonth, 1);
      }
      break;
    }

    case PaymentFrequency.QUARTERLY: {
      // Start from the beginning of the month containing startDate
      let currentQuarter = startOfMonth(startDate);

      while (isBefore(currentQuarter, endDate) || isSameDay(currentQuarter, endDate)) {
        const paymentDate = getPaymentDateForMonth(currentQuarter, paymentDay);

        // Only include payment dates that fall within the project period
        if (isWithinInterval(paymentDate, { start: startDate, end: endDate })) {
          paymentDates.push(paymentDate);
        }

        // Move to next quarter (3 months)
        currentQuarter = addQuarters(currentQuarter, 1);
      }
      break;
    }
  }

  return paymentDates;
}

export const addContributors = authActionClient
  .metadata({ actionName: 'addContributors' })
  .inputSchema(contributorSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.userId) throw new Error('Session not found.');

    const { projectId, contributors } = parsedInput;

    const result = await prisma.$transaction(async (tx) => {
      // find the project
      const project = await tx.project.findUnique({ where: { id: projectId } });

      if (!project) return null;

      // generate payment date schedules
      const paymentSchedule = generatePaymentDates(
        project.startDate,
        project.endDate,
        project.paymentDay,
        project.paymentFrequency
      );

      // create the contributors
      for (let contributor of contributors) {
        await tx.contributor.create({
          data: {
            ...contributor,
            projectId,
            paymentSchedules: {
              createMany: {
                data: paymentSchedule.map((ps) => ({
                  amountToPay: contributor.contributionAmount,
                  scheduledPaymentDate: ps,
                  projectId,
                })),
              },
            },
          },
        });
      }

      return { success: true };
    });

    revalidatePath(`/projects/${projectId}`);

    return result;
  });

export const updateContributor = authActionClient
  .metadata({ actionName: 'updateContributor' })
  .inputSchema(contributorEditSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.userId) throw new Error('Session not found.');

    const { id, name, contributionAmount, email, phoneNumber } = parsedInput;

    const result = await prisma.contributor.update({
      where: { id },
      data: { name, contributionAmount, email, phoneNumber },
      select: {
        id: true,
        projectId: true,
      },
    });

    revalidatePath(`/projects/${result.projectId}`);

    return {
      contributor: result,
    };
  });

export const deleteContributor = authActionClient
  .metadata({ actionName: 'deleteContributor' })
  .inputSchema(contributorIdSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.userId) throw new Error('Session not found.');

    const { id } = parsedInput;

    const result = await prisma.contributor.delete({
      where: { id },
    });

    revalidatePath(`/projects/${result.projectId}`);

    return {
      success: true,
    };
  });
