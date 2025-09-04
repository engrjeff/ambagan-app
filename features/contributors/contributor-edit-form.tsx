'use client';

import { Contributor } from '@/app/generated/prisma';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { SubmitButton } from '@/components/ui/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateContributor } from './actions';
import { ContributorEditInputs, contributorEditSchema } from './schema';

export function ContributorEditFormDialog({
  contributor,
}: {
  contributor: Contributor;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="iconSm" aria-label="Edit" variant="ghost">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Update {contributor.name}</DialogTitle>
          <DialogDescription>Make sure to save your changes.</DialogDescription>
        </DialogHeader>
        <ContributorEditForm
          contributor={contributor}
          onAfterSave={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ContributorEditForm({
  onAfterSave,
  contributor,
}: {
  onAfterSave: VoidFunction;
  contributor: Contributor;
}) {
  const form = useForm<ContributorEditInputs>({
    resolver: zodResolver(contributorEditSchema),
    defaultValues: {
      id: contributor.id,
      name: contributor.name,
      contributionAmount: contributor.contributionAmount,
      email: contributor.email ?? '',
      phoneNumber: contributor.phoneNumber ?? '',
    },
  });

  const updateAction = useAction(updateContributor, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating contributor`);
    },
  });

  const isBusy = updateAction.isPending;

  const onFormError: SubmitErrorHandler<ContributorEditInputs> = (errors) => {
    console.log(`Contributor Edit Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ContributorEditInputs> = async (data) => {
    try {
      const result = await updateAction.executeAsync(data);

      if (result.data?.contributor?.id) {
        toast.success(`Changes saved!`);

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
                  <NumberInput
                    usePeso
                    {...form.register(field.name, { valueAsNumber: true })}
                  />
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
                  Email{' '}
                  <span className="text-xs italic text-muted-foreground">
                    Optional
                  </span>
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
                  Phone{' '}
                  <span className="text-xs italic text-muted-foreground">
                    Optional
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="+639XXXXXXXXX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-6 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton loading={isBusy}>Save Changes</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
