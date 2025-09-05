'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { ContributorInputs, contributorSchema } from './schema';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MinusIcon, PlusIcon, UserPlusIcon } from 'lucide-react';

import { Project } from '@/app/generated/prisma';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SubmitButton } from '@/components/ui/submit-button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { addContributors } from './actions';

const dummy = [
  'Jeff Segovia',
  'Kim Lopez',
  'Carlo Rosal',
  'Aerol Allauigan',
  'Daniel Baja',
  'Chris Bernardo',
  'Nathaniel Ablan',
  'Kevin Yu',
  'Cyrus Coligado',
  'Eugene Ababa',
  'Willy Ann Castelo',
  'Mariz Segovia',
];

export function ContributorsFormDialog({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlusIcon /> Add Contributor
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-4xl px-0 gap-0 pb-0"
      >
        <DialogHeader className="border-b px-6 pb-6">
          <DialogTitle>Add Contributors</DialogTitle>
          <DialogDescription>
            Fill out the form below with the contributors&apos; details.
          </DialogDescription>
        </DialogHeader>
        <ContributorsForm
          project={project}
          onAfterSave={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ContributorsForm({
  project,
  onAfterSave,
}: {
  project: Project;
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
            email: '',
            phoneNumber: '',
          }))
        : [
            {
              name: '',
              email: '',
              phoneNumber: '',
              contributionAmount: project.defaultContributionAmount,
            },
            {
              name: '',
              email: '',
              phoneNumber: '',
              contributionAmount: project.defaultContributionAmount,
            },
            {
              name: '',
              email: '',
              phoneNumber: '',
              contributionAmount: project.defaultContributionAmount,
            },
          ],
    },
  });

  const contributorsFields = useFieldArray({
    control: form.control,
    name: 'contributors',
  });

  const createAction = useAction(addContributors, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error adding contributors`);
    },
  });

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<ContributorInputs> = (errors) => {
    console.log(`Contributors Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ContributorInputs> = async (data) => {
    try {
      const result = await createAction.executeAsync(data);

      if (result.data?.success) {
        toast.success(`${data?.contributors?.length} Contributors were added!`);

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
      <form
        className="select-none"
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
      >
        <fieldset disabled={isBusy} className="disabled:opacity-90">
          <ScrollArea className="h-[400px] p-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-background">
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Contribution Amount</TableHead>
                  <TableHead>
                    Email{' '}
                    <span className="text-muted-foreground text-xs italic">
                      (Optional)
                    </span>
                  </TableHead>
                  <TableHead>
                    Phone{' '}
                    <span className="text-muted-foreground text-xs italic">
                      (Optional)
                    </span>
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
                                className="rounded-none dark:bg-background"
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
                            <FormLabel className="sr-only">
                              Contribution Amount
                            </FormLabel>
                            <FormControl>
                              <NumberInput
                                usePeso
                                className="rounded-none dark:bg-background"
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
                                className="rounded-none dark:bg-background"
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
                            <FormLabel className="sr-only">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                inputMode="tel"
                                placeholder="+639XXXXXXXXXX"
                                className="rounded-none dark:bg-background"
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

          <div className="p-4 flex items-center gap-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                contributorsFields.prepend({
                  name: '',
                  contributionAmount: project.defaultContributionAmount,
                  email: '',
                  phoneNumber: '',
                });
              }}
            >
              <PlusIcon /> Add Row
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="ml-auto"
            >
              Cancel
            </Button>

            <SubmitButton loading={isBusy}>Save Contributors</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
