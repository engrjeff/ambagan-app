import { z } from 'zod';

const contributorItemSchema = z.object({
  name: z.string({ error: 'Name is required.' }).min(1, 'Name is required.'),
  contributionAmount: z
    .number({ error: 'Contribution amount is required.' })
    .gt(0, { error: 'Invalid amount.' }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.email().safeParse(val).success, {
      message: 'Invalid email.',
    }),
  phoneNumber: z.string().optional(),
});

export const contributorIdSchema = z.object({
  id: z.string({ error: 'ID is required.' }).min(1, 'ID is required.'),
});

export const contributorEditSchema = contributorItemSchema.extend(
  contributorIdSchema.shape
);

export type ContributorEditInputs = z.infer<typeof contributorEditSchema>;

export const contributorSchema = z.object({
  projectId: z.string({ error: 'Project is required.' }),
  contributors: z
    .array(contributorItemSchema)
    .min(1, { message: 'At least one contributor is required.' })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.name.toLowerCase())
      ).size;

      const errorPosition = items.length - 1;

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: 'custom',
          message: `Already exists.`,
          path: [errorPosition, 'name'],
        });
      }
    }),
});

export type ContributorInputs = z.infer<typeof contributorSchema>;
