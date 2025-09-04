'use client';

import {
  Contributor,
  ContributorStatus,
  PaymentSchedule,
} from '@/app/generated/prisma';
import { Badge } from '@/components/ui/badge';
import { SearchField } from '@/components/ui/search-field';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatCurrency,
  getLastPaymentDate,
  getTotalContributionsPaid,
} from '@/lib/utils';
import { CheckCircleIcon, PackageIcon, XCircleIcon } from 'lucide-react';
import { ContributorsFormDialog } from '../contributors/contributors-form';
import { ContributorDeleteDialog } from './contributor-delete-dialog';
import { ContributorEditFormDialog } from './contributor-edit-form';

interface ContributorListProps {
  projectTitle: string;
  contributors: Array<
    Contributor & {
      paymentSchedules: PaymentSchedule[];
    }
  >;
}

export function ContributorList({
  projectTitle,
  contributors,
}: ContributorListProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <SearchField
          paramName="c"
          placeholder={`Search ${contributors.length} contributors`}
        />
        <ContributorsFormDialog />
      </div>

      <div className="border rounded-md my-4 pb-4 max-h-[60vh] overflow-x-auto">
        <Table>
          <TableCaption>
            A list of contributors for {projectTitle}.
          </TableCaption>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-4 text-center">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Last Payment Date</TableHead>
              <TableHead className="text-right">Contribution</TableHead>
              <TableHead className="text-right">Total Paid</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributors.length === 0 ? (
              <TableRow className="hover:bg-background">
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 p-2 rounded-full bg-muted/50 dark:bg-muted/20">
                      <PackageIcon className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      No contributors found
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add contributors now.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contributors.map((contributor, index) => (
                <TableRow key={contributor.id} className="hover:bg-background">
                  <TableCell className="font-medium text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contributor.email ? contributor.email : 'No email'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getLastPaymentDate(contributor.paymentSchedules)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(contributor.contributionAmount)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {getTotalContributionsPaid(contributor.paymentSchedules)}
                  </TableCell>
                  <TableCell className="text-center">
                    {contributor.status === ContributorStatus.ACTIVE ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      >
                        <XCircleIcon className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center space-x-3">
                    <ContributorEditFormDialog contributor={contributor} />
                    <ContributorDeleteDialog contributor={contributor} />
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
