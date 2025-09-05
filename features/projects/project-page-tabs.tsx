'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartSplineIcon,
  PhilippinePesoIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

const projectPages = [
  {
    id: 'insights',
    label: 'Insights',
    Icon: ChartSplineIcon,
  },
  {
    id: 'contributors',
    label: 'Contributors',
    Icon: UsersIcon,
  },
  {
    id: 'payment-tracking',
    label: 'Payment Tracking',
    Icon: PhilippinePesoIcon,
  },
  {
    id: 'settings',
    label: 'Settings',
    Icon: SettingsIcon,
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
      <TabsList className="text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
        {projectPages.map((page) => (
          <TabsTrigger
            key={page.id}
            value={page.id}
            className="hover:bg-accent dark:data-[state=active]:text-primary dark:data-[state=active]:border-none hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 dark:data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <page.Icon className="hidden" /> {page.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
