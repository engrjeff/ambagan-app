"use client";

import { ReactNode } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ChartSplineIcon, PhilippinePesoIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projectPages = [
  {
    id: "insights",
    label: "Insights",
    Icon: ChartSplineIcon,
  },
  {
    id: "contributors",
    label: "Contributors",
    Icon: UsersIcon,
  },
  {
    id: "payment-tracking",
    label: "Payments",
    Icon: PhilippinePesoIcon,
  },
  {
    id: "settings",
    label: "Settings",
    Icon: SettingsIcon,
  },
];

export function ProjectPageTabs({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const params = useParams<{ projectId: string }>();
  const router = useRouter();

  const tab = searchParams.get("tab") ?? projectPages[0].id;

  return (
    <Tabs
      defaultValue={tab}
      value={tab}
      onValueChange={(value) => router.push(`/projects/${params.projectId}?tab=${value}`)}
    >
      <TabsList className="text-foreground h-auto w-full gap-2 rounded-none border-b bg-transparent px-0 py-1 md:w-min">
        {projectPages.slice(0, 3).map((page) => (
          <TabsTrigger
            key={page.id}
            value={page.id}
            className="hover:bg-accent dark:data-[state=active]:text-primary hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:shadow-none md:hidden dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent"
          >
            <page.Icon className="hidden" /> {page.label}
          </TabsTrigger>
        ))}
        {projectPages.map((page) => (
          <TabsTrigger
            key={page.id}
            value={page.id}
            className="hover:bg-accent dark:data-[state=active]:text-primary hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative hidden after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:shadow-none md:inline-flex dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent"
          >
            <page.Icon className="hidden" /> {page.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
