"use client";

import { useState } from "react";
import { useSession } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Contributor, PaymentMethod, PaymentSchedule } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageInput } from "@/components/ui/image-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { SelectNative } from "@/components/ui/select-native";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { uploadProofOfPayment } from "@/lib/services";
import { formatDate } from "@/lib/utils";
import { createPaymentRecord } from "./actions";
import { PaymentInputs, paymentSchema } from "./schema";

interface Props {
  schedule: PaymentSchedule;
  contributor: Contributor;
  projectName: string;
}

export function PaymentFormDialog(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">Mark as Paid</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Payment Record</DialogTitle>
          <DialogDescription>
            Payment of {props.contributor.name} for{" "}
            <span className="text-foreground">{formatDate(props.schedule.scheduledPaymentDate.toISOString())}</span>
          </DialogDescription>
        </DialogHeader>

        <PaymentForm onAfterSave={() => setOpen(false)} {...props} />
      </DialogContent>
    </Dialog>
  );
}

function PaymentForm({ onAfterSave, schedule, contributor, projectName }: Props & { onAfterSave: VoidFunction }) {
  const session = useSession();

  const form = useForm<PaymentInputs>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      scheduleId: schedule.id,
      paymentDate: "",
      actualAmountPaid: contributor.contributionAmount,
      paymentMethod: PaymentMethod.CASH,
      proofOfPayment: "",
      note: "",
    },
  });

  const [uploading, setUploading] = useState(false);

  const createAction = useAction(createPaymentRecord, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error creating payment record.`);
    },
  });

  const isBusy = createAction.isPending || uploading;

  const onFormError: SubmitErrorHandler<PaymentInputs> = (errors) => {
    console.log(`Payment Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<PaymentInputs> = async (data) => {
    try {
      if (!session.session?.user?.id) return;

      setUploading(true);

      let proofOfPaymentUrl: string | undefined = undefined;

      if (data.proofOfPayment) {
        // upload
        const uploadResult = await uploadProofOfPayment({
          file: data.proofOfPayment,
          userId: session.session.user.id,
          dueDate: formatDate(schedule.scheduledPaymentDate.toISOString()),
          projectName: projectName,
          contributor: contributor.name,
        });

        if (uploadResult.error) {
          toast.error("Error uploading file.");
          return;
        }

        proofOfPaymentUrl = uploadResult.url as string;
      }

      const result = await createAction.executeAsync({
        ...data,
        proofOfPayment: proofOfPaymentUrl,
      });

      if (result.data?.payment?.id) {
        toast.success(`Payment record created!`);

        onAfterSave();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  function handleClose() {
    onAfterSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <fieldset disabled={isBusy} className="space-y-3 disabled:opacity-90">
          <div className="space-y-2">
            <Label htmlFor="contributor">Contributor</Label>
            <Input disabled readOnly defaultValue={contributor.name} />
          </div>
          <FormField
            control={form.control}
            name="actualAmountPaid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid</FormLabel>
                <FormControl>
                  <NumberInput usePeso {...form.register(field.name, { valueAsNumber: true })} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 items-start gap-4">
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Input type="date" max={format(new Date(), "yyyy-MM-dd")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <SelectNative {...field}>
                      <option value="">Payment method</option>
                      {[PaymentMethod.CASH, PaymentMethod.GCASH, PaymentMethod.BANK_TRANSFER].map((option) => (
                        <option key={option} value={option} className="capitalize">
                          {option.replaceAll("_", " ")}
                        </option>
                      ))}
                    </SelectNative>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Optional note" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proofOfPayment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageInput
                    src={form.watch("proofOfPayment")}
                    label="Proof of Payment"
                    desc="Upload proof of payment"
                    onChange={(file, src) => {
                      field.onChange(src);
                    }}
                    onDelete={() => {
                      field.onChange(undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton loading={isBusy}>Save Payment</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
