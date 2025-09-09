"use client";

import { ChangeEvent, useId, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, ChevronDownIcon, Grid2x2CheckIcon, ImportIcon, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { SubmitErrorHandler, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import z from "zod";

import { Contributor, Project } from "@/app/generated/prisma";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubmitButton } from "@/components/ui/submit-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { addContributors } from "./actions";
import { ContributorInputs, contributorSchema } from "./schema";

export function ContributorsImportDialog({
  project,
  currentContributors,
}: {
  project: Project;
  currentContributors: Contributor[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="rounded-tr-none rounded-br-none">
            Import
          </Button>
        </DialogTrigger>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="gap-0 p-0 sm:max-w-4xl"
        >
          <DialogHeader className="border-b p-4 text-left">
            <DialogTitle>Import Contributors</DialogTitle>
            <DialogDescription>
              Upload a <Badge variant="outline">.xlsx</Badge> file.
            </DialogDescription>
          </DialogHeader>
          <ContributorImportContent
            project={project}
            currentContributors={currentContributors}
            onAfterSave={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="iconSm" variant="outline" className="rounded-tl-none rounded-bl-none border-l-0">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href="/templates/contributor-template.xlsx" download target="_blank">
              <Grid2x2CheckIcon size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              Download Template
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

type ContributorEntry = ContributorInputs["contributors"][number];
type EntryError = Record<number, { [k in keyof ContributorEntry]?: string }>;

function ContributorImportContent({
  project,
  currentContributors,
  onAfterSave,
}: {
  project: Project;
  currentContributors: Contributor[];
  onAfterSave: VoidFunction;
}) {
  const [view, setView] = useState<"upload" | "success" | "error">("upload");
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputId = useId();

  const [dataWithError, setDataWithError] = useState<ContributorInputs["contributors"]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryError>({});

  const form = useForm<ContributorInputs>({
    resolver: zodResolver(contributorSchema),
    defaultValues: { projectId: project.id, contributors: [] },
  });

  const contributorFields = useFieldArray({ control: form.control, name: "contributors" });

  const createAction = useAction(addContributors, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error saving imported contributors`);
    },
  });

  const isBusy = createAction.isPending;

  const currentContributorNames = new Set(currentContributors.map((c) => c.name.toLowerCase()));
  const currentContributorEmails = new Set(currentContributors.map((c) => c.email?.toLowerCase()).filter(Boolean));

  const handleChangeFile = () => {
    setDataWithError([]);
    contributorFields.remove();
    setEntryErrors({});
    setView("upload");
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    const file = files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadstart = () => {
      setFileLoading(true);
    };

    reader.onloadend = () => {
      setFileLoading(false);
    };

    reader.onload = (event) => {
      if (!event.target?.result) return;

      const workbook = XLSX.read(event.target.result, {
        type: "binary",
        cellDates: true,
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const sheetData = XLSX.utils.sheet_to_json<ContributorInputs["contributors"][number]>(sheet, {
        raw: false,
        header: ["name", "contributionAmount", "email", "phoneNumber"],
      });

      const rawData = sheetData.slice(1);

      const validatedData = contributorSchema.safeParse({
        projectId: project.id,
        contributors: sheetData.slice(1).map((d) => ({
          name: d.name,
          contributionAmount: Number(d.contributionAmount),
          email: d.email,
          phoneNumber: d.phoneNumber,
        })),
      });

      const tempEntryError: EntryError = {};

      const duplicateNameIndex = rawData.findIndex((s) => currentContributorNames.has(s.name.toLowerCase()));

      if (duplicateNameIndex !== -1) {
        const i = rawData.at(duplicateNameIndex);
        tempEntryError[duplicateNameIndex] = {
          name: `${i?.name} already exists.`,
          contributionAmount: undefined,
          email: undefined,
          phoneNumber: undefined,
        };

        setDataWithError(rawData);
        setEntryErrors(tempEntryError);

        setView("error");
        return;
      }

      const duplicateEmailIndex = rawData.findIndex((s) => currentContributorEmails.has(s.email?.toLowerCase()));

      if (duplicateEmailIndex !== -1) {
        const i = rawData.at(duplicateEmailIndex);
        tempEntryError[duplicateEmailIndex] = {
          name: undefined,
          contributionAmount: undefined,
          email: `${i?.email} already exists.`,
          phoneNumber: undefined,
        };

        setDataWithError(rawData);
        setEntryErrors(tempEntryError);

        setView("error");
        return;
      }

      if (!validatedData.success) {
        z.treeifyError(validatedData.error).properties?.contributors?.items?.forEach((item, index) => {
          // collect field errors
          tempEntryError[index] = {
            name: item.properties?.name?.errors?.at(0),
            contributionAmount: item.properties?.contributionAmount?.errors?.at(0),
            email: item.properties?.email?.errors?.at(0),
            phoneNumber: item.properties?.phoneNumber?.errors?.at(0),
          };
        });

        setDataWithError(rawData);
        setEntryErrors(tempEntryError);
        setView("error");
        return;
      }

      if (validatedData.success) {
        setView("success");

        contributorFields.replace(validatedData.data.contributors);

        toast.success(`Parsed ${validatedData.data.contributors.length} rows.`);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const onFormError: SubmitErrorHandler<ContributorInputs> = (errors) => {
    console.log(`Contributors Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ContributorInputs> = async (data) => {
    try {
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
      <fieldset disabled={isBusy} className="group p-4 disabled:opacity-90">
        {view === "upload" ? (
          <div>
            <label
              htmlFor={fileInputId}
              className="hover:bg-muted/20 flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed group-disabled:cursor-not-allowed group-disabled:hover:bg-transparent"
            >
              {fileLoading ? (
                <>
                  <Loader2Icon strokeWidth={1.5} className="text-muted-foreground size-5 animate-spin" />
                  <span className="text-muted-foreground text-center text-sm">Loading file...</span>
                </>
              ) : (
                <>
                  <ImportIcon strokeWidth={1.5} className="text-muted-foreground mb-3 size-6" />
                  <span className="text-muted-foreground text-center text-sm">
                    Select a <Badge variant="outline">.xlsx</Badge> file
                  </span>
                </>
              )}
              <input
                type="file"
                hidden
                name={fileInputId}
                id={fileInputId}
                key={view}
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
              />
            </label>
            <div className="mt-4 flex gap-3 border-t p-4 pb-0">
              <DialogClose asChild>
                <Button type="button" size="sm" variant="secondary" className="ml-auto">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </div>
        ) : null}

        {view === "success" && contributorFields.fields.length ? (
          <div className="w-full max-w-full rounded-md border [&>div]:max-h-[350px]">
            <Table className="[&_td]:border-border [&_th]:border-border table-auto border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
              <TableHeader className="bg-card sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-4 text-center">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contribution</TableHead>
                  <TableHead>
                    Email <span className="text-muted-foreground text-[10px] italic">(Optional)</span>
                  </TableHead>
                  <TableHead>
                    Phone <span className="text-muted-foreground text-[10px] italic">(Optional)</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributorFields.fields.map((c, index) => (
                  <TableRow key={c.id}>
                    <TableCell className="bg-card w-4 border-r text-center">{index + 1}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(c.contributionAmount)}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phoneNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex gap-3 border-t p-4">
              <Button type="button" size="sm" variant="secondary" onClick={handleChangeFile}>
                Change File
              </Button>
              <DialogClose asChild>
                <Button type="button" size="sm" variant="ghost" className="ml-auto">
                  Cancel
                </Button>
              </DialogClose>
              <SubmitButton size="sm" loading={isBusy}>
                Save Contributors
              </SubmitButton>
            </div>
          </div>
        ) : null}

        {view === "error" && dataWithError.length ? (
          <Alert variant="destructive" className="mb-4 flex items-start">
            <AlertCircleIcon />
            <div>
              <AlertTitle>Check row issues</AlertTitle>
              <AlertDescription>
                <p className="text-destructive">Upload the corrected file.</p>
              </AlertDescription>
            </div>
            <Button type="button" size="sm" variant="outline" className="ml-auto" onClick={handleChangeFile}>
              Change File
            </Button>
          </Alert>
        ) : null}

        {view === "error" && dataWithError.length ? (
          <div className="w-full max-w-full rounded-md border [&>div]:max-h-[350px]">
            <Table className="table-auto border-separate border-spacing-0 [&_th]:border-b">
              <TableHeader className="bg-card sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-4 text-center">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contribution</TableHead>
                  <TableHead>
                    Email <span className="text-muted-foreground text-[10px] italic">(Optional)</span>
                  </TableHead>
                  <TableHead>
                    Phone <span className="text-muted-foreground text-[10px] italic">(Optional)</span>
                  </TableHead>
                  <TableHead>Issues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataWithError.map((c, index) => (
                  <TableRow
                    key={index}
                    data-has-error={Object.values(entryErrors[index] ?? {}).some(Boolean)}
                    className="data-[has-error=true]:border data-[has-error=true]:border-red-500 data-[has-error=true]:bg-red-500/20"
                  >
                    <TableCell className="bg-card w-4 border-r text-center">{index + 1}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(c.contributionAmount)}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phoneNumber}</TableCell>
                    <TableCell>
                      <ul>
                        {Object.values(entryErrors[index] ?? {}).map((err, errIndex) => (
                          <li key={errIndex} className="text-xs">
                            {err}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </fieldset>
    </form>
  );
}
