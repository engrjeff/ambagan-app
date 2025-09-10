"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { paymentSchema } from "./schema";

export const createPaymentRecord = authActionClient
  .metadata({ actionName: "createPaymentRecord" })
  .inputSchema(paymentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.userId) throw new Error("Session not found.");

    const { paymentDate } = parsedInput;

    const payment = await prisma.paymentSchedule.update({
      where: {
        id: parsedInput.scheduleId,
      },
      data: {
        actualAmountPaid: parsedInput.actualAmountPaid,
        paymentDate: new Date(paymentDate),
        proofOfPayment: parsedInput.proofOfPayment,
        note: parsedInput.note,
        paymentMethod: parsedInput.paymentMethod,
      },
    });

    revalidatePath(`/projects/${payment.projectId}`);
    revalidatePath(`/contributors/${payment.contributorId}`);

    return {
      payment,
    };
  });
