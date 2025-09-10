"use client";

import { ReactNode } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PhilippinePesoIcon, UserIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const contributorPages = [
  {
    id: "payments",
    label: "Payments",
    Icon: PhilippinePesoIcon,
  },
  {
    id: "details",
    label: "Details",
    Icon: UserIcon,
  },
];

export function ContributorPageTabs({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const params = useParams<{ contributorId: string }>();
  const router = useRouter();

  const tab = searchParams.get("tab") ?? contributorPages[0].id;

  return (
    <Tabs
      defaultValue={tab}
      value={tab}
      onValueChange={(value) => router.push(`/contributors/${params.contributorId}?tab=${value}`)}
    >
      <TabsList className="text-foreground h-auto w-full gap-2 rounded-none border-b bg-transparent px-0 py-1 md:w-min">
        {contributorPages.map((page) => (
          <TabsTrigger
            key={page.id}
            value={page.id}
            className="hover:bg-accent dark:data-[state=active]:text-primary hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative inline-flex after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:shadow-none dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent"
          >
            <page.Icon className="hidden" /> {page.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
