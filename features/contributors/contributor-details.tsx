import { CheckCircleIcon, XCircleIcon } from "lucide-react";

import { Contributor, ContributorStatus } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ContributorEditFormDialog } from "./contributor-edit-form";

export function ContributorDetails({ contributor }: { contributor: Contributor }) {
  return (
    <div className="bg-card flex-1 overflow-y-auto rounded-lg border px-4 py-2">
      <dl className="space-y-2 divide-y divide-dashed">
        <dd className="flex items-center justify-between pb-2">
          {contributor.status === ContributorStatus.ACTIVE ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircleIcon className="mr-1 h-3 w-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
              <XCircleIcon className="mr-1 h-3 w-3" />
              Inactive
            </Badge>
          )}
          <ContributorEditFormDialog contributor={contributor} />
        </dd>
        <dd className="space-y-1 pb-2">
          <p className="text-muted-foreground text-xs">Name</p>
          <p className="text-sm font-semibold">{contributor.name}</p>
        </dd>

        <dd className="space-y-1 pb-2">
          <p className="text-muted-foreground text-xs">Committed Amount</p>
          <p className="font-mono text-sm font-semibold">{formatCurrency(contributor.contributionAmount)}</p>
        </dd>

        <dd className="space-y-1 pb-2">
          <p className="text-muted-foreground text-xs">Email</p>
          <p className="text-sm font-semibold">{contributor.email ? contributor.email : "No email set"}</p>
        </dd>

        <dd className="space-y-1 pb-2">
          <p className="text-muted-foreground text-xs">Phone Number</p>
          <p className="text-sm font-semibold">
            {contributor.phoneNumber ? contributor.phoneNumber : "No phone number set"}
          </p>
        </dd>
      </dl>
    </div>
  );
}
