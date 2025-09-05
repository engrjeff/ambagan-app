'use client';

import {
  Contributor,
  PaymentMethod,
  PaymentSchedule,
} from '@/app/generated/prisma';
import { PaymentMethodBadge } from '@/components/payment-method-badge';
import { SortLink } from '@/components/sort-link';
import { Badge } from '@/components/ui/badge';
import { SearchField } from '@/components/ui/search-field';
import { SelectNative } from '@/components/ui/select-native';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate, isOverdue } from '@/lib/utils';
import { AlertTriangleIcon, PackageIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';
import { PaymentDetails } from './payment-details';
import { PaymentFormDialog } from './payment-form';

interface Props {
  projectName: string;
  paymentSchedules: Array<PaymentSchedule & { contributor: Contributor }>;
  paymentDateOptions: Array<{ id: string; value: string; label: string }>;
}

export function PaymentsList({
  projectName,
  paymentSchedules,
  paymentDateOptions,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilterChange(e: ChangeEvent<HTMLSelectElement>) {
    const newParams = new URLSearchParams(searchParams);

    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    if (value.trim()) {
      newParams.set(name, value.trim());
    } else {
      newParams.delete(name);
    }

    // Reset to first page when searching
    newParams.delete('page');

    // Update URL with new search params
    const newUrl = `${pathname}?${newParams.toString()}`;
    router.replace(newUrl);
  }

  return (
    <>
      <div className="flex items-center gap-4 justify-between">
        <SearchField paramName="c" placeholder="Search contributors" />
        <div className="flex items-center gap-4 ml-auto">
          <SelectNative
            aria-label="filter by payment status"
            name="status"
            onChange={handleFilterChange}
            defaultValue={searchParams.get('status') ?? ''}
          >
            <option value="">Status</option>
            {[
              PaymentMethod.UNPAID,
              PaymentMethod.CASH,
              PaymentMethod.GCASH,
              PaymentMethod.BANK_TRANSFER,
            ].map((d) => (
              <option key={d} value={d}>
                {d.replace('_', ' ')}
              </option>
            ))}
          </SelectNative>
          {paymentDateOptions.length <= 1 ? null : (
            <SelectNative
              defaultValue={
                searchParams.get('date') ?? paymentDateOptions.at(0)?.value
              }
              name="date"
              aria-label="filter by schedule date"
              onChange={handleFilterChange}
            >
              <option value="">Select date</option>
              {paymentDateOptions.map((d) => (
                <option key={d.id} value={d.value}>
                  {d.label}
                </option>
              ))}
            </SelectNative>
          )}
        </div>
      </div>
      <div className="border rounded-md my-4 pb-4 max-h-[60vh] overflow-x-auto">
        <Table>
          <TableCaption>Payment history.</TableCaption>
          <TableHeader className="bg-card">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-4 text-center">#</TableHead>
              <TableHead>
                <SortLink sortValue="paidBy" title="Paid by" />
              </TableHead>
              <TableHead>
                <SortLink
                  className="justify-end -mr-4"
                  sortValue="actualAmountPaid"
                  title="Amount Paid"
                />
              </TableHead>
              <TableHead>
                <SortLink
                  className="justify-center"
                  sortValue="paymentMethod"
                  title="Payment Method"
                />
              </TableHead>
              <TableHead className="text-center">
                <SortLink
                  className="justify-center"
                  sortValue="paymentDate"
                  title="Payment Date"
                />
              </TableHead>
              <TableHead className="text-center">Schedule Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentSchedules.length === 0 ? (
              <TableRow className="hover:bg-background">
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 p-2 rounded-full bg-muted/50 dark:bg-muted/20">
                      <PackageIcon className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      No payments made yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add a payment record now.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paymentSchedules.map((payment, index) => (
                <TableRow key={payment.id} className="hover:bg-background">
                  <TableCell className="font-medium text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.contributor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.contributor.email
                          ? payment.contributor.email
                          : 'No email'}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-right font-mono">
                    {formatCurrency(payment.actualAmountPaid)}
                  </TableCell>
                  <TableCell className="text-center capitalize">
                    <PaymentMethodBadge paymentMethod={payment.paymentMethod} />
                  </TableCell>

                  <TableCell className="text-center">
                    {payment.paymentDate ? (
                      formatDate(payment.paymentDate.toISOString())
                    ) : isOverdue(payment.scheduledPaymentDate) ? (
                      <Badge variant="outline" className="text-yellow-500">
                        <AlertTriangleIcon /> Overdue
                      </Badge>
                    ) : (
                      '--'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(payment.scheduledPaymentDate.toISOString())}
                  </TableCell>
                  <TableCell className="text-center space-x-3">
                    {payment.paymentMethod === PaymentMethod.UNPAID ? (
                      <PaymentFormDialog
                        projectName={projectName}
                        schedule={payment}
                        contributor={payment.contributor}
                      />
                    ) : (
                      <PaymentDetails payment={payment} />
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
