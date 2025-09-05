import { z } from "zod";

import { PaymentMethod } from "@/app/generated/prisma";

export const paymentSchema = z.object({
  scheduleId: z.string({ error: "Payment schedule is required." }).min(1, "Payment schedule is required."),
  actualAmountPaid: z.number({ error: "Actual amount paid is required." }).gt(0, { error: "Invalid amount." }),
  paymentDate: z.iso.date({
    error: "Invalid date.",
  }),
  paymentMethod: z.enum(PaymentMethod, { error: "Invalid payment method." }),
  proofOfPayment: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || z.url().safeParse(val).success, {
      message: "Invalid image.",
    }),

  note: z.string().optional(),
});

export type PaymentInputs = z.infer<typeof paymentSchema>;
