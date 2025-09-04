'use server';

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { projectSchema } from './schema';

export const createProject = authActionClient
  .metadata({ actionName: 'createProject' })
  .inputSchema(projectSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.userId) throw new Error('Session not found.');

    const { startDate, endDate, ...data } = parsedInput;

    const project = await prisma.project.create({
      data: {
        ...data,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: user.userId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    revalidatePath('/projects');

    return {
      project,
    };
  });
