"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Project } from "@/app/generated/prisma";
import { FloatingActionButton } from "@/components/floating-action-button";
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
import { SubmitButton } from "@/components/ui/submit-button";
import { addContributors } from "./actions";
import { SingleContributorInputs, singleContributorSchema } from "./schema";

export function ContributorCreateFormDialog({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FloatingActionButton>
          <PlusIcon />
        </FloatingActionButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Contributor</DialogTitle>
          <DialogDescription>Fill out the form below.</DialogDescription>
        </DialogHeader>
        <ContributorCreateForm project={project} onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ContributorCreateForm({ project, onAfterSave }: { project: Project; onAfterSave: VoidFunction }) {
  const form = useForm<SingleContributorInputs>({
    resolver: zodResolver(singleContributorSchema),
    defaultValues: {
      projectId: project.id,
      name: "",
      contributionAmount: project.defaultContributionAmount,
      email: "",
      phoneNumber: "",
    },
  });

  const createAction = useAction(addContributors, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error creating contributor`);
    },
  });

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<SingleContributorInputs> = (errors) => {
    console.log(`Contributor Add Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<SingleContributorInputs> = async (data) => {
    try {
      const result = await createAction.executeAsync({
        projectId: data.projectId,
        contributors: [
          {
            name: data.name,
            contributionAmount: data.contributionAmount,
            email: data.email,
            phoneNumber: data.phoneNumber,
          },
        ],
      });

      if (result.data?.success) {
        toast.success(`Contributor saved!`);

        onAfterSave();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  function handleClose() {
    onAfterSave();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <fieldset disabled={isBusy} className="space-y-3 disabled:opacity-90">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contributionAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contribution Amount</FormLabel>
                <FormControl>
                  <NumberInput usePeso {...form.register(field.name, { valueAsNumber: true })} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-muted-foreground text-xs italic">Optional</span>
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone <span className="text-muted-foreground text-xs italic">Optional</span>
                </FormLabel>
                <FormControl>
                  <Input type="tel" inputMode="tel" placeholder="+639XXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton loading={isBusy}>Save</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
