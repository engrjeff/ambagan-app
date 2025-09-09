"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { SubmitErrorHandler, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Contributor, Project } from "@/app/generated/prisma";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubmitButton } from "@/components/ui/submit-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addContributors } from "./actions";
import { ContributorInputs, contributorSchema } from "./schema";

const dummy = [
  "Jeff Segovia",
  "Kim Lopez",
  "Carlo Rosal",
  "Aerol Allauigan",
  "Daniel Baja",
  "Chris Bernardo",
  "Nathaniel Ablan",
  "Kevin Yu",
  "Cyrus Coligado",
  "Eugene Ababa",
  "Willy Ann Castelo",
  "Mariz Segovia",
];

export function ContributorsFormDialog({
  project,
  currentContributors,
}: {
  project: Project;
  currentContributors: Contributor[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Contributor</Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="gap-0 px-0 pb-0 sm:max-w-4xl"
      >
        <DialogHeader className="border-b px-6 pb-6">
          <DialogTitle>Add Contributors</DialogTitle>
          <DialogDescription>Fill out the form below with the contributors&apos; details.</DialogDescription>
        </DialogHeader>
        <ContributorsForm
          project={project}
          currentContributors={currentContributors}
          onAfterSave={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ContributorsForm({
  project,
  currentContributors,
  onAfterSave,
}: {
  project: Project;
  currentContributors: Contributor[];
  onAfterSave: VoidFunction;
}) {
  const { projectId } = useParams<{ projectId: string }>();

  const debug = false;

  const form = useForm<ContributorInputs>({
    resolver: zodResolver(contributorSchema),
    defaultValues: {
      projectId,
      contributors: debug
        ? dummy.map((d) => ({
            name: d,
            contributionAmount: project.defaultContributionAmount,
            email: "",
            phoneNumber: "",
          }))
        : [
            {
              name: "",
              email: "",
              phoneNumber: "",
              contributionAmount: project.defaultContributionAmount,
            },
            {
              name: "",
              email: "",
              phoneNumber: "",
              contributionAmount: project.defaultContributionAmount,
            },
          ],
    },
  });

  const contributorsFields = useFieldArray({
    control: form.control,
    name: "contributors",
  });

  const createAction = useAction(addContributors, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error adding contributors`);
    },
  });

  const isBusy = createAction.isPending;

  const currentContributorNames = new Set(currentContributors.map((c) => c.name.toLowerCase()));
  const currentContributorEmails = new Set(currentContributors.map((c) => c.email?.toLowerCase()).filter(Boolean));

  const onFormError: SubmitErrorHandler<ContributorInputs> = (errors) => {
    console.log(`Contributors Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ContributorInputs> = async (data) => {
    try {
      const contributorValues = form.getValues("contributors");
      // check for duplicate names against existing contributors
      const duplicateNameIndex = contributorValues.findIndex((c) => currentContributorNames.has(c.name.toLowerCase()));

      if (duplicateNameIndex !== -1) {
        const i = contributorValues[duplicateNameIndex];
        form.setError("root", { message: `${i.name} already exists.` });
        form.setError(`contributors.${duplicateNameIndex}.name`, { message: `${i.name} already exists.` });
        return;
      }

      // check for duplicate emails against existing contributors
      const duplicateEmailIndex = contributorValues.findIndex((c) =>
        currentContributorEmails.has(c.email?.toLowerCase())
      );

      if (duplicateEmailIndex !== -1) {
        const i = contributorValues[duplicateEmailIndex];
        form.setError("root", { message: `${i.email} is already in use.` });
        form.setError(`contributors.${duplicateEmailIndex}.email`, { message: `${i.email} is already in use.` });
        return;
      }

      const result = await createAction.executeAsync(data);

      if (result.data?.success) {
        toast.success(`${data?.contributors?.length} contributors were added!`);

        onAfterSave();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleClose = () => {
    form.reset();
    onAfterSave();
  };

  return (
    <Form {...form}>
      <form className="select-none" autoComplete="off" onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <fieldset disabled={isBusy} className="disabled:opacity-90">
          <ScrollArea className="h-[400px] max-w-full p-4">
            {form.formState.errors.root?.message ? (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Please fix the duplicate values.</AlertTitle>
                <AlertDescription>
                  <p>{form.formState.errors.root?.message}</p>
                </AlertDescription>
              </Alert>
            ) : null}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-background">
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Contribution Amount</TableHead>
                  <TableHead>
                    Email <span className="text-muted-foreground text-xs italic">(Optional)</span>
                  </TableHead>
                  <TableHead>
                    Phone <span className="text-muted-foreground text-xs italic">(Optional)</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributorsFields.fields.map((field, index) => (
                  <TableRow key={field.id} className="hover:bg-background">
                    <TableCell className="p-0.5">
                      <FormField
                        control={form.control}
                        name={`contributors.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Name</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                placeholder="Name"
                                className="dark:bg-background rounded-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="sr-only" />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0.5">
                      <FormField
                        control={form.control}
                        name={`contributors.${index}.contributionAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Contribution Amount</FormLabel>
                            <FormControl>
                              <NumberInput
                                usePeso
                                className="dark:bg-background rounded-none"
                                {...form.register(field.name, {
                                  valueAsNumber: true,
                                })}
                              />
                            </FormControl>
                            <FormMessage className="sr-only" />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0.5">
                      <FormField
                        control={form.control}
                        name={`contributors.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Email"
                                className="dark:bg-background rounded-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="sr-only" />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0.5">
                      <FormField
                        control={form.control}
                        name={`contributors.${index}.phoneNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                inputMode="tel"
                                placeholder="+639XXXXXXXXXX"
                                className="dark:bg-background rounded-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="sr-only" />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0.5">
                      <Button
                        type="button"
                        size="iconSm"
                        aria-label="Remove contributor"
                        title="Remove contributor"
                        variant="outline"
                        className="hover:text-destructive rounded-none"
                        disabled={contributorsFields.fields.length === 1}
                        onClick={() => contributorsFields.remove(index)}
                      >
                        <MinusIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="flex items-center gap-4 border-t p-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                contributorsFields.prepend({
                  name: "",
                  contributionAmount: project.defaultContributionAmount,
                  email: "",
                  phoneNumber: "",
                });
              }}
            >
              <PlusIcon /> Add Row
            </Button>

            <Button type="button" variant="secondary" onClick={handleClose} className="ml-auto">
              Cancel
            </Button>

            <SubmitButton loading={isBusy}>Save Contributors</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
