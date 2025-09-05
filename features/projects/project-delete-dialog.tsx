'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SubmitButton } from '@/components/ui/submit-button';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteProject } from './actions';

export function ProjectDeleteDialog({
  projectName,
  projectId,
}: {
  projectName: string;
  projectId: string;
}) {
  const router = useRouter();

  const deleteAction = useAction(deleteProject, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error deleting project.`);
    },
  });

  const isBusy = deleteAction.isPending;

  async function handleDelete() {
    try {
      const result = await deleteAction.executeAsync({ id: projectId });

      if (result.data?.success) {
        toast.success('Successfully deleted!');

        router.replace('/projects');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error deleting project');
    }
  }

  return (
    <Card className="bg-background border-red-700">
      <CardHeader className="border-b">
        <CardTitle>Delete Project</CardTitle>
        <CardDescription>
          Completely delete this project and all its related records from the
          system&apos;s database.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-red-700 text-white hover:bg-red-600">
              Delete Project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                project <span className="font-semibold">{projectName}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
              <SubmitButton
                variant="destructive"
                className="bg-red-700 text-white hover:bg-red-700/80 dark:bg-red-700"
                loading={isBusy}
                onClick={handleDelete}
              >
                Continue
              </SubmitButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
