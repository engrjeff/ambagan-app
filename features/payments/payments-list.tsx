"use client";

import { ChangeEvent } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AlertTriangleIcon, PackageIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

import { Contributor, PaymentMethod, PaymentSchedule } from "@/app/generated/prisma";
import { PaymentMethodBadge } from "@/components/payment-method-badge";
import { SortLink } from "@/components/sort-link";
import { Badge } from "@/components/ui/badge";
import { SearchField } from "@/components/ui/search-field";
import { SelectNative } from "@/components/ui/select-native";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, isOverdue } from "@/lib/utils";
import { PaymentDetails } from "./payment-details";
import { PaymentFormDialog } from "./payment-form";

interface Props {
  projectName: string;
  paymentSchedules: Array<PaymentSchedule & { contributor: Contributor }>;
  paymentDateOptions: Array<{ id: string; value: string; label: string }>;
}

export function PaymentsList({ projectName, paymentSchedules, paymentDateOptions }: Props) {
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
    newParams.delete("page");

    // Update URL with new search params
    const newUrl = `${pathname}?${newParams.toString()}`;
    router.replace(newUrl);
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchField paramName="c" placeholder="Search contributors" />
        <div className="flex items-center gap-4 md:ml-auto">
          <SelectNative
            aria-label="filter by payment status"
            name="status"
            onChange={handleFilterChange}
            defaultValue={searchParams.get("status") ?? ""}
            className="flex-1"
          >
            <option value="">Status</option>
            {[PaymentMethod.UNPAID, PaymentMethod.CASH, PaymentMethod.GCASH, PaymentMethod.BANK_TRANSFER].map((d) => (
              <option key={d} value={d}>
                {d.replace("_", " ")}
              </option>
            ))}
          </SelectNative>
          {paymentDateOptions.length <= 1 ? null : (
            <SelectNative
              defaultValue={searchParams.get("date") ?? paymentDateOptions.at(0)?.value}
              name="date"
              aria-label="filter by schedule date"
              onChange={handleFilterChange}
              className="flex-1"
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
      <div className="my-4 max-h-[60vh] overflow-x-auto rounded-md border pb-4">
        <Table>
          <TableCaption>Payment history.</TableCaption>
          <TableHeader className="bg-card">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-4 text-center">#</TableHead>
              <TableHead>
                <SortLink sortValue="paidBy" title="Paid by" />
              </TableHead>
              <TableHead>
                <SortLink className="-mr-4 justify-end" sortValue="actualAmountPaid" title="Amount Paid" />
              </TableHead>
              <TableHead>
                <SortLink className="justify-center" sortValue="paymentMethod" title="Payment Method" />
              </TableHead>
              <TableHead className="text-center">
                <SortLink className="justify-center" sortValue="paymentDate" title="Payment Date" />
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
                    <div className="bg-muted/50 dark:bg-muted/20 mb-3 rounded-full p-2">
                      <PackageIcon className="text-muted-foreground size-6" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">No payments made yet</p>
                    <p className="text-muted-foreground mt-1 text-xs">Add a payment record now.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paymentSchedules.map((payment, index) => (
                <TableRow key={payment.id} className="hover:bg-background">
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Link href={`/contributors/${payment.contributor.id}`} className="group block">
                      <p className="font-medium group-hover:underline">{payment.contributor.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {payment.contributor.email ? payment.contributor.email : "No email"}
                      </p>
                    </Link>
                  </TableCell>

                  <TableCell className="text-right font-mono">{formatCurrency(payment.actualAmountPaid)}</TableCell>
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
                      "--"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(payment.scheduledPaymentDate.toISOString())}
                  </TableCell>
                  <TableCell className="space-x-3 text-center">
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
