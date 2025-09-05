"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { PaymentFrequency } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { SelectNative } from "@/components/ui/select-native";
import { SubmitButton } from "@/components/ui/submit-button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "./actions";
import { colors, ColorSelect } from "./color-select";
import { IconInput } from "./icon-input";
import { projectSchema, type ProjectInputs } from "./schema";

export function ProjectForm({ initialData }: { initialData?: ProjectInputs }) {
  const form = useForm<ProjectInputs>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      targetAmount: initialData?.targetAmount ?? 0,
      defaultContributionAmount: initialData?.defaultContributionAmount ?? 0,
      paymentDay: initialData?.paymentDay ?? 1,
      paymentFrequency: initialData?.paymentFrequency ?? PaymentFrequency.MONTHLY,
      icon: initialData?.icon ?? "home",
      color: initialData?.color ?? colors[0].value,
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
    },
  });

  const [isOneTime, setIsOneTime] = useState(false);

  const createAction = useAction(createProject, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error creating project`);
    },
  });

  const isWeekly = form.watch("paymentFrequency") === PaymentFrequency.WEEKLY;

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<ProjectInputs> = (errors) => {
    console.log(`Project Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ProjectInputs> = async (data) => {
    try {
      const result = await createAction.executeAsync(data);

      if (result.data?.project) {
        toast.success(`${result.data?.project?.title} was successfully created!`);

        // redirect to project's contributors page
        window.location.replace(`/projects/${result.data?.project?.id}?tab=contributors`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  function handleClose() {
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <fieldset disabled={isBusy} className="space-y-4 disabled:opacity-90">
          <div className="flex items-center justify-between gap-2 rounded-md border p-4">
            <Label htmlFor="isOneTime">Is this is a one-time contribution?</Label>

            <Switch
              id="isOneTime"
              checked={isOneTime}
              onCheckedChange={(checked) => {
                setIsOneTime(checked);

                if (checked) {
                  form.setValue("paymentFrequency", PaymentFrequency.ONE_TIME);
                  if (form.getValues("startDate")) {
                    form.setValue("endDate", form.getValues("startDate"));
                  }
                } else {
                  form.setValue("paymentFrequency", PaymentFrequency.MONTHLY);
                  form.setValue("endDate", "");
                }
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Enter project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your project" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 items-start gap-4">
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <NumberInput
                      usePeso
                      min={0}
                      placeholder="0"
                      {...form.register(field.name, {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultContributionAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contribution</FormLabel>
                  <FormControl>
                    <NumberInput
                      usePeso
                      min={0}
                      placeholder="0"
                      {...form.register(field.name, {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isOneTime ? (
            <div className="grid grid-cols-2 items-start gap-4">
              <FormField
                control={form.control}
                name="paymentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <SelectNative {...field} disabled>
                        <option value="">Payment method</option>
                        {[
                          PaymentFrequency.ONE_TIME,
                          PaymentFrequency.WEEKLY,
                          PaymentFrequency.MONTHLY,
                          PaymentFrequency.QUARTERLY,
                        ].map((option) => (
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

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);

                          if (e.currentTarget.value) {
                            form.setValue("endDate", e.currentTarget.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 items-start gap-4">
              <FormField
                control={form.control}
                name="paymentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <SelectNative {...field}>
                        <option value="">Payment method</option>
                        {[
                          PaymentFrequency.ONE_TIME,
                          PaymentFrequency.WEEKLY,
                          PaymentFrequency.MONTHLY,
                          PaymentFrequency.QUARTERLY,
                        ].map((option) => (
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
              {isWeekly ? (
                <FormField
                  control={form.control}
                  name="paymentDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Day</FormLabel>
                      <FormControl>
                        <SelectNative
                          {...form.register(field.name, {
                            valueAsNumber: true,
                          })}
                        >
                          <option value="">Payment Day</option>
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                            (option, index) => (
                              <option key={option} value={index + 1}>
                                {option}
                              </option>
                            )
                          )}
                        </SelectNative>
                      </FormControl>
                      <FormDescription className="hidden">Day of the month when contributions are due</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="paymentDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Day</FormLabel>
                      <FormControl>
                        <NumberInput
                          list="due-dates"
                          min={1}
                          max={31}
                          step={1}
                          placeholder="e.g., 15 for 15th"
                          {...form.register(field.name, {
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                      <datalist id="due-dates">
                        <option value="1"></option>
                        <option value="10"></option>
                        <option value="15"></option>
                        <option value="25"></option>
                        <option value="30"></option>
                      </datalist>
                      <FormDescription className="hidden">Day of the month when contributions are due</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="grid grid-cols-2 items-start gap-4">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorSelect value={field.value} onValueChange={field.onChange} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <IconInput value={field.value} onValueChange={field.onChange} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-4 py-6">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton loading={isBusy}>{initialData ? "Update Project" : "Create Project"}</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
