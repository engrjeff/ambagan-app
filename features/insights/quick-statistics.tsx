"use client";

import { CalendarIcon, HourglassIcon, TrendingUpIcon } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn, toCompactWithCurrency } from "@/lib/utils";

export function QuickStatistics(props: {
  totalRaised: number;
  targetAmount: number;
  contributionsThisMonth: number;
  paidContributorsCount: number;
  contributorsCount: number;
}) {
  const data = [
    {
      name: "Total Raised",
      value: toCompactWithCurrency(props.totalRaised),
      iconClass: "bg-primary/20 text-primary",
      icon: TrendingUpIcon,
      subtext: `of ${toCompactWithCurrency(props.targetAmount)}`,
    },
    {
      name: "Contributions This Month",
      value: toCompactWithCurrency(props.contributionsThisMonth),
      iconClass: "bg-green-600/20 text-green-600",
      icon: CalendarIcon,
      subtext: `from ${props.paidContributorsCount} contributors`,
    },
    {
      name: "Unpaid Contributors",
      value: props.contributorsCount - props.paidContributorsCount,
      iconClass: "bg-yellow-600/20 text-yellow-600",
      icon: HourglassIcon,
      subtext: `out of ${props.contributorsCount} contributors`,
    },
  ];

  return (
    <dl className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {data.map((item) => (
        <Card key={item.name} className="gap-0 p-0">
          <CardContent className="relative p-6">
            <dd className="flex items-start justify-between space-x-2">
              <span className="text-muted-foreground truncate text-sm">{item.name}</span>
              <div
                className={cn(
                  "absolute top-2 right-2 flex size-9 items-center justify-center rounded-lg",
                  item.iconClass
                )}
              >
                <item.icon className="size-4" />
              </div>
            </dd>
            <dd className="text-foreground mt-1 text-3xl font-semibold">
              {item.value} <span className="text-muted-foreground text-xs font-normal">{item.subtext}</span>
            </dd>
          </CardContent>
          <CardFooter className="border-border hidden justify-end border-t p-0!">
            <a href={"#"} className="hover:text-primary/90 px-6 py-3 text-sm font-medium">
              View more &#8594;
            </a>
          </CardFooter>
        </Card>
      ))}
    </dl>
  );
}
