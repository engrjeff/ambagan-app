"use client";

import Link from "next/link";
import { CheckCircleIcon, PackageIcon, XCircleIcon } from "lucide-react";

import { Contributor, ContributorStatus, PaymentSchedule, Project } from "@/app/generated/prisma";
import { SortLink } from "@/components/sort-link";
import { Badge } from "@/components/ui/badge";
import { SearchField } from "@/components/ui/search-field";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, getLastPaymentDate, getTotalContributionsPaid } from "@/lib/utils";
import { ContributorsFormDialog } from "../contributors/contributors-form";
import { ContributorChangeStatusDialog } from "./contributor-change-status-dialog";
import { ContributorCreateFormDialog } from "./contributor-create-form";
import { ContributorDeleteDialog } from "./contributor-delete-dialog";
import { ContributorEditFormDialog } from "./contributor-edit-form";
import { ContributorsImportDialog } from "./contributor-import-dialog";

interface ContributorListProps {
  project: Project;
  contributors: Array<
    Contributor & {
      paymentSchedules: PaymentSchedule[];
    }
  >;
}

export function ContributorList({ project, contributors }: ContributorListProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <SearchField paramName="c" placeholder={`Search ${contributors.length} contributors`} />
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <ContributorsImportDialog project={project} currentContributors={contributors} />
          <ContributorsFormDialog project={project} currentContributors={contributors} />
        </div>
        <div className="md:hidden">
          <ContributorCreateFormDialog project={project} />
        </div>
      </div>

      <div className="my-4 max-h-[60vh] overflow-x-auto rounded-md border pb-4">
        <Table>
          <TableCaption>A list of contributors for {project.title}.</TableCaption>
          <TableHeader className="bg-card">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-4 text-center">#</TableHead>
              <TableHead>
                <SortLink sortValue="name" title="Name" />
              </TableHead>
              <TableHead>
                <SortLink className="-mr-4 justify-end" sortValue="contributionAmount" title="Contribution" />
              </TableHead>
              <TableHead className="text-right">Total Paid</TableHead>
              <TableHead className="text-center">Last Payment Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributors.length === 0 ? (
              <TableRow className="hover:bg-background">
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-muted/50 dark:bg-muted/20 mb-3 rounded-full p-2">
                      <PackageIcon className="text-muted-foreground size-6" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">No contributors found</p>
                    <p className="text-muted-foreground mt-1 text-xs">Add contributors now.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contributors.map((contributor, index) => (
                <TableRow key={contributor.id} className="hover:bg-background">
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Link href={`/contributors/${contributor.id}`} className="group block">
                      <p className="font-medium group-hover:underline">{contributor.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {contributor.email ? contributor.email : "No email"}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(contributor.contributionAmount)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {getTotalContributionsPaid(contributor.paymentSchedules)}
                  </TableCell>
                  <TableCell className="text-center">{getLastPaymentDate(contributor.paymentSchedules)}</TableCell>
                  <TableCell className="text-center">
                    {contributor.status === ContributorStatus.ACTIVE ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <CheckCircleIcon className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      >
                        <XCircleIcon className="mr-1 h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="space-x-3 text-center">
                    {contributor.status === ContributorStatus.ACTIVE ? (
                      <>
                        <ContributorEditFormDialog contributor={contributor} />
                        <ContributorDeleteDialog contributor={contributor} />
                      </>
                    ) : (
                      <ContributorChangeStatusDialog contributor={contributor} />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
