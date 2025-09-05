import { PaymentFrequency } from '@/app/generated/prisma';
import { isBefore } from 'date-fns';
import { z } from 'zod';

export const projectSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(100, 'Title must be less than 100 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(500, 'Description must be less than 500 characters'),
    targetAmount: z
      .number({ message: 'Target amount must be a number' })
      .positive('Target amount must be positive')
      .min(1, 'Target amount must be at least $1'),
    defaultContributionAmount: z
      .number({ message: 'Required' })
      .gt(0, 'Must not be zero'),
    paymentDay: z
      .number({ error: 'Required' })
      .int('Invalid payment day')
      .min(1, 'Invalid payment day')
      .max(31, 'Invalid payment day'),
    paymentFrequency: z.enum(PaymentFrequency),
    icon: z.string().min(1, 'Icon is required'),
    color: z
      .string()
      .min(1, 'Color is required')
      .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Provide a valid color'),
    startDate: z.iso.date({
      message: 'Start date must be a valid date',
    }),
    endDate: z.iso.date({
      message: 'End date must be a valid date',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.paymentFrequency === PaymentFrequency.WEEKLY) {
      if (data.paymentDay > 7) {
        ctx.addIssue({
          code: 'custom',
          message: `Must not exceed 7.`,
          path: ['paymentDay'],
        });
      }
    } else if (
      data.paymentFrequency === PaymentFrequency.MONTHLY ||
      data.paymentFrequency === PaymentFrequency.QUARTERLY
    ) {
      if (data.endDate && data.startDate) {
        const end = new Date(data.endDate);
        const start = new Date(data.startDate);

        if (!isBefore(start, end)) {
          console.log('Running');

          ctx.addIssue({
            code: 'custom',
            message: `End date must be later than start date.`,
            path: ['endDate'],
          });
        }
      }
    }
  });

export const projectIdSchema = z.object({
  id: z
    .string({ error: 'ID is required.' })
    .min(1, { error: 'ID is required.' }),
});

export const projectEditSchema = projectSchema
  .omit({
    startDate: true,
    endDate: true,
    paymentDay: true,
    paymentFrequency: true,
  })
  .extend(projectIdSchema.shape);

export type ProjectInputs = z.infer<typeof projectSchema>;

export type ProjectEditInputs = z.infer<typeof projectEditSchema>;
