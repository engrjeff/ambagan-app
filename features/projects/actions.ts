'use server';

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { projectEditSchema, projectIdSchema, projectSchema } from './schema';

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

export const updateProject = authActionClient
  .metadata({ actionName: 'updateProject' })
  .inputSchema(projectEditSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.userId) throw new Error('Session not found.');

    const { id, ...data } = parsedInput;

    const project = await prisma.project.update({
      where: { id },
      data: data,
      select: {
        id: true,
        title: true,
      },
    });

    revalidatePath('/projects');
    revalidatePath(`/projects/${project.id}`);

    return {
      project,
    };
  });

export const deleteProject = authActionClient
  .metadata({ actionName: 'deleteProject' })
  .inputSchema(projectIdSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.userId) throw new Error('Session not found.');

    const { id } = parsedInput;

    const result = await prisma.project.delete({
      where: { id },
    });

    revalidatePath('/projects');

    return {
      success: true,
    };
  });
