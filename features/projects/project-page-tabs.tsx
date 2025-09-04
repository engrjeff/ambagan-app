'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

const projectPages = [
  {
    id: 'insights',
    label: 'Insights',
  },
  {
    id: 'contributors',
    label: 'Contributors',
  },
  {
    id: 'payment-tracking',
    label: 'Payment Tracking',
  },
  {
    id: 'edit',
    label: 'Settings',
  },
];

export function ProjectPageTabs({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const params = useParams<{ projectId: string }>();
  const router = useRouter();

  const tab = searchParams.get('tab') ?? projectPages[0].id;

  return (
    <Tabs
      defaultValue={tab}
      value={tab}
      onValueChange={(value) =>
        router.push(`/projects/${params.projectId}?tab=${value}`)
      }
    >
      <TabsList>
        {projectPages.map((page) => (
          <TabsTrigger key={page.id} value={page.id}>
            {page.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
