import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { ContributorDetails } from "@/features/contributors/contributor-details";
import { ContributorPageTabs } from "@/features/contributors/contributor-page-tabs";
import { ContributorPaymentListItem } from "@/features/contributors/contributor-payment-list-item";
import { getContributorDetail } from "@/features/contributors/queries";

interface PageProps {
  params: Promise<{ contributorId: string }>;
}

async function ContributorDetailPage({ params }: PageProps) {
  const pageParams = await params;

  const contributor = await getContributorDetail({ contributorId: pageParams.contributorId });

  if (!contributor) return notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4">
      {/* back button */}
      <Button size="sm" variant="link" className="text-foreground px-0 has-[>svg]:px-0" asChild>
        <Link href="/projects">
          <ArrowLeftIcon /> My Projects
        </Link>
      </Button>
      {/* top bar */}
      <div className="flex items-center">
        <div>
          <h1 className="text-lg font-semibold">{contributor.name}</h1>
          <p className="text-muted-foreground text-sm">
            Contributor for <span className="font-semibold">{contributor.project.title}</span>
          </p>
        </div>
        <div className="ml-auto hidden">
          <Button size="sm">
            <CheckIcon />
            Mark as Fully Paid
          </Button>
        </div>
      </div>
      {/* tabs */}
      <Suspense>
        <ContributorPageTabs>
          <TabsContent value="payments" className="space-y-4 py-2">
            <ul className="space-y-3">
              {contributor.paymentSchedules.map((payment) => (
                <li key={payment.id}>
                  <ContributorPaymentListItem
                    payment={payment}
                    contributor={contributor}
                    projectTitle={contributor.project.title}
                  />
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="details" className="space-y-4 py-2">
            <ContributorDetails contributor={contributor} />
          </TabsContent>
        </ContributorPageTabs>
      </Suspense>
    </div>
  );
}

export default ContributorDetailPage;
