"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Project } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { updateProject } from "./actions";
import { colors, ColorSelect } from "./color-select";
import { IconInput } from "./icon-input";
import { ProjectEditInputs, projectEditSchema } from "./schema";

export function ProjectEditForm({ project }: { project: Project }) {
  const form = useForm<ProjectEditInputs>({
    resolver: zodResolver(projectEditSchema),
    defaultValues: {
      id: project.id,
      title: project?.title ?? "",
      description: project?.description ?? "",
      targetAmount: project?.targetAmount ?? 0,
      defaultContributionAmount: project?.defaultContributionAmount ?? 0,
      icon: project?.icon ?? "home",
      color: project?.color ?? colors[0].value,
    },
  });

  const updateAction = useAction(updateProject, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating project`);
    },
  });

  const isBusy = updateAction.isPending;

  const onFormError: SubmitErrorHandler<ProjectEditInputs> = (errors) => {
    console.log(`Project Edit Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ProjectEditInputs> = async (data) => {
    try {
      const result = await updateAction.executeAsync(data);

      if (result.data?.project) {
        toast.success(`${result.data?.project?.title} was successfully updated!`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  function handleReset() {
    form.reset();
  }

  return (
    <Form {...form}>
      <Card className="bg-background">
        <CardHeader className="border-b">
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>Project details. Make sure to save your changes.</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
          <fieldset disabled={isBusy} className="disabled:opacity-90">
            <CardContent className="space-y-3 pb-6">
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
            </CardContent>

            <CardFooter className="justify-end gap-4 border-t pt-6">
              <Button type="button" variant="ghost" onClick={handleReset}>
                Reset
              </Button>
              <SubmitButton loading={isBusy}>Save Changes</SubmitButton>
            </CardFooter>
          </fieldset>
        </form>
      </Card>
    </Form>
  );
}
