'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { SubmitButton } from '@/components/ui/submit-button';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createProject } from './actions';
import { ColorSelect } from './color-select';
import { IconInput } from './icon-input';
import { projectSchema, type ProjectInputs } from './schema';

export function ProjectForm({ initialData }: { initialData?: ProjectInputs }) {
  const form = useForm<ProjectInputs>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      targetAmount: initialData?.targetAmount ?? 0,
      defaultContributionAmount: initialData?.defaultContributionAmount ?? 0,
      paymentDay: initialData?.paymentDay ?? 15,
      icon: initialData?.icon ?? 'home',
      color: initialData?.color ?? '#16a34a',
      startDate: initialData?.startDate ?? '',
      endDate: initialData?.endDate ?? '',
    },
  });

  const createAction = useAction(createProject, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error creating project`);
    },
  });

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<ProjectInputs> = (errors) => {
    console.log(`Project Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ProjectInputs> = async (data) => {
    try {
      const result = await createAction.executeAsync(data);

      if (result.data?.project) {
        toast.success(
          `${result.data?.project?.title} was successfully created!`
        );

        // redirect to project's contributors page
        window.location.replace(
          `/projects/${result.data?.project?.id}?tab=contributors`
        );
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
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Enter project title"
                    {...field}
                  />
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
                  <Textarea
                    placeholder="Describe your project"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4 items-start">
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
                      {...form.register('targetAmount', {
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
                      {...form.register('defaultContributionAmount', {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    {...form.register(field.name, { valueAsNumber: true })}
                  />
                </FormControl>
                <datalist id="due-dates">
                  <option value="1"></option>
                  <option value="10"></option>
                  <option value="15"></option>
                  <option value="25"></option>
                  <option value="30"></option>
                </datalist>
                <FormDescription>
                  Day of the month when contributions are due
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4 items-start">
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

          <div className="grid grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    />
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
                    <IconInput
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton loading={isBusy}>
              {initialData ? 'Update Project' : 'Create Project'}
            </SubmitButton>
          </DialogFooter>
        </fieldset>
      </form>
    </Form>
  );
}
