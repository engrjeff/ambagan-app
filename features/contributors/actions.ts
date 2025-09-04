'use server';

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/safe-action';
import {
  addMonths,
  getDaysInMonth,
  isBefore,
  isSameDay,
  isWithinInterval,
  setDate,
  startOfMonth,
} from 'date-fns';
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
 * Generates all payment dates between start and end dates for a given day of month
 */
function generatePaymentDates(
  startDate: Date,
  endDate: Date,
  paymentDay: number
): Date[] {
  const paymentDates: Date[] = [];

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
        project.paymentDay
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
