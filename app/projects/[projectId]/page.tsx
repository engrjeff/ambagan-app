import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { ContributorList } from '@/features/contributors/contributor-list';
import { ProjectPageTabs } from '@/features/projects/project-page-tabs';
import { getProjectById } from '@/features/projects/queries';
import { type Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { PendingPayments } from '@/features/insights/pending-payments';
import { QuickStatistics } from '@/features/insights/quick-statistics';
import { RecentPayments } from '@/features/insights/recent-payments';
import { TopContributors } from '@/features/insights/top-contributors';
import { PaymentsList } from '@/features/payments/payments-list';
import { ProjectDeleteDialog } from '@/features/projects/project-delete-dialog';
import { ProjectEditForm } from '@/features/projects/project-edit-form';
import { ProjectIcon } from '@/features/projects/project-icon';
import { ArrowLeftIcon, PencilIcon, PenLineIcon } from 'lucide-react';
import { cache, Suspense } from 'react';

const cachedProject = cache(getProjectById);

interface PageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{
    tab?: string;
    c?: string;
    date?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    status?: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const pageParams = await params;

  const { project } = await cachedProject({ projectId: pageParams.projectId });

  return {
    title: project ? project?.title : 'Project Not Found',
  };
};

async function ProjectContributorsPage({ params, searchParams }: PageProps) {
  const pageParams = await params;
  const pageSearchParams = await searchParams;

  const { project, paymentDateOptions, quickStatistics, topContributors } =
    await cachedProject({
      projectId: pageParams.projectId,
      ...pageSearchParams,
    });

  if (!project) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-4">
      <Button
        size="sm"
        variant="link"
        className="text-foreground px-0 has-[>svg]:px-0"
        asChild
      >
        <Link href="/projects">
          <ArrowLeftIcon /> My Projects
        </Link>
      </Button>
      {/* top bar */}
      <div className="flex items-center gap-4">
        <ProjectIcon iconName={project.icon} color={project.color} />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold">{project.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="go to Project settings"
            >
              <Link
                href={{
                  pathname: `/projects/${project.id}`,
                  query: { tab: 'settings' },
                }}
              >
                <PenLineIcon />
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">{project.description}</p>
        </div>
        <div className="ml-auto hidden md:block">
          <Button variant="secondary" asChild>
            <Link
              href={{
                pathname: `/projects/${project.id}`,
                query: { tab: 'settings' },
              }}
            >
              <PencilIcon /> Update
            </Link>
          </Button>
        </div>
      </div>
      {/* tabs */}
      <Suspense>
        <ProjectPageTabs key={pageSearchParams.tab}>
          <TabsContent value="insights" className="py-2 space-y-4">
            <QuickStatistics {...quickStatistics} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <TopContributors
                project={project}
                topContributors={topContributors}
              />
              <div className="space-y-4">
                <RecentPayments paymentSchedules={project.paymentSchedules} />
                <PendingPayments paymentSchedules={project.paymentSchedules} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="contributors" className="py-2">
            <ContributorList
              project={project}
              contributors={project.contributors}
            />
          </TabsContent>
          <TabsContent value="payment-tracking" className="py-2">
            <PaymentsList
              projectName={project.title}
              paymentDateOptions={paymentDateOptions}
              paymentSchedules={project.paymentSchedules}
            />
          </TabsContent>
          <TabsContent value="settings" className="py-2 space-y-6">
            <div className="max-w-md mx-auto">
              <ProjectEditForm project={project} />
            </div>
            <Separator />
            <div className="max-w-md mx-auto">
              <ProjectDeleteDialog
                projectName={project.title}
                projectId={project.id}
              />
            </div>
          </TabsContent>
        </ProjectPageTabs>
      </Suspense>
    </div>
  );
}

export default ProjectContributorsPage;
