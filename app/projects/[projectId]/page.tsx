import { cache, Suspense } from "react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, PenLineIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { ContributorList } from "@/features/contributors/contributor-list";
import { PendingPayments } from "@/features/insights/pending-payments";
import { QuickStatistics } from "@/features/insights/quick-statistics";
import { RecentPayments } from "@/features/insights/recent-payments";
import { TopContributors } from "@/features/insights/top-contributors";
import { PaymentsList } from "@/features/payments/payments-list";
import { ProjectDeleteDialog } from "@/features/projects/project-delete-dialog";
import { ProjectEditForm } from "@/features/projects/project-edit-form";
import { ProjectIcon } from "@/features/projects/project-icon";
import { ProjectPageTabs } from "@/features/projects/project-page-tabs";
import { getProjectById } from "@/features/projects/queries";

const cachedProject = cache(getProjectById);

interface PageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{
    tab?: string;
    c?: string;
    date?: string;
    sort?: string;
    order?: "asc" | "desc";
    status?: string;
  }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const pageParams = await params;

  const { project } = await cachedProject({ projectId: pageParams.projectId });

  return {
    title: project ? project?.title : "Project Not Found",
  };
};

async function ProjectContributorsPage({ params, searchParams }: PageProps) {
  const pageParams = await params;
  const pageSearchParams = await searchParams;

  const { project, paymentDateOptions, quickStatistics, topContributors } = await cachedProject({
    projectId: pageParams.projectId,
    ...pageSearchParams,
  });

  if (!project) return notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4">
      <Button size="sm" variant="link" className="text-foreground px-0 has-[>svg]:px-0" asChild>
        <Link href="/projects">
          <ArrowLeftIcon /> My Projects
        </Link>
      </Button>
      {/* top bar */}
      <div className="flex items-center gap-4">
        <ProjectIcon iconName={project.icon} color={project.color} />
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-sm font-semibold md:text-base">{project.title}</h1>
            <p className="text-muted-foreground text-xs md:text-sm">{project.description}</p>
          </div>
          <Button variant="ghost" size="icon" asChild aria-label="go to Project settings">
            <Link
              href={{
                pathname: `/projects/${project.id}`,
                query: { tab: "settings" },
              }}
            >
              <PenLineIcon />
            </Link>
          </Button>
        </div>
      </div>
      {/* tabs */}
      <Suspense>
        <ProjectPageTabs key={pageSearchParams.tab}>
          <TabsContent value="insights" className="space-y-4 py-2">
            <QuickStatistics {...quickStatistics} />
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
              <TopContributors project={project} topContributors={topContributors} />
              <div className="space-y-4">
                <RecentPayments paymentSchedules={project.paymentSchedules} />
                <PendingPayments paymentSchedules={project.paymentSchedules} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="contributors" className="py-2">
            <ContributorList project={project} contributors={project.contributors} />
          </TabsContent>
          <TabsContent value="payment-tracking" className="py-2">
            <PaymentsList
              projectName={project.title}
              paymentDateOptions={paymentDateOptions}
              paymentSchedules={project.paymentSchedules}
            />
          </TabsContent>
          <TabsContent value="settings" className="space-y-6 py-2">
            <div className="mx-auto max-w-md">
              <ProjectEditForm project={project} />
            </div>
            <Separator />
            <div className="mx-auto max-w-md">
              <ProjectDeleteDialog projectName={project.title} projectId={project.id} />
            </div>
          </TabsContent>
        </ProjectPageTabs>
      </Suspense>
    </div>
  );
}

export default ProjectContributorsPage;
