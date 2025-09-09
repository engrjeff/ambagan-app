"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { Contributor } from "@/app/generated/prisma";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { makeContributorActive } from "./actions";

export function ContributorChangeStatusDialog({ contributor }: { contributor: Contributor }) {
  const [open, setOpen] = useState(false);

  const updateAction = useAction(makeContributorActive, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating contributor status`);
    },
  });

  const isBusy = updateAction.isPending;

  async function handleStatusChange() {
    try {
      const result = await updateAction.executeAsync({ id: contributor.id });

      if (result.data?.contributor) {
        toast.success(`Contributor status updated!`);

        setOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="link">
          Mark as Active
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Make Status Active</AlertDialogTitle>
          <AlertDialogDescription>
            This action will mark <span className="font-semibold underline">{contributor.name}</span> as ACTIVE.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
          <SubmitButton loading={isBusy} onClick={handleStatusChange}>
            Continue
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
