'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn, toCompactWithCurrency } from '@/lib/utils';
import { CalendarIcon, HourglassIcon, TrendingUpIcon } from 'lucide-react';
import { useMemo } from 'react';

export function QuickStatistics(props: {
  totalRaised: number;
  targetAmount: number;
  contributionsThisMonth: number;
  paidContributorsCount: number;
  contributorsCount: number;
}) {
  const data = useMemo(
    () => [
      {
        name: 'Total Raised',
        value: toCompactWithCurrency(props.totalRaised),
        iconClass: 'bg-primary/20 text-primary',
        icon: TrendingUpIcon,
        subtext: `of ${toCompactWithCurrency(props.targetAmount)}`,
      },
      {
        name: 'Contributions This Month',
        value: toCompactWithCurrency(props.contributionsThisMonth),
        iconClass: 'bg-green-600/20 text-green-600',
        icon: CalendarIcon,
        subtext: `from ${props.paidContributorsCount} contributors`,
      },
      {
        name: 'Unpaid Contributors',
        value: props.contributorsCount - props.paidContributorsCount,
        iconClass: 'bg-yellow-600/20 text-yellow-600',
        icon: HourglassIcon,
        subtext: `out of ${props.contributorsCount} contributors`,
      },
    ],
    []
  );

  return (
    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {data.map((item) => (
        <Card key={item.name} className="p-0 gap-0">
          <CardContent className="p-6 relative">
            <dd className="flex items-start justify-between space-x-2">
              <span className="truncate text-sm text-muted-foreground">
                {item.name}
              </span>
              <div
                className={cn(
                  'absolute top-2 right-2 size-9 rounded-xl flex items-center justify-center',
                  item.iconClass
                )}
              >
                <item.icon className="size-4" />
              </div>
            </dd>
            <dd className="mt-1 text-3xl font-semibold text-foreground">
              {item.value}{' '}
              <span className="text-xs text-muted-foreground font-normal">
                {item.subtext}
              </span>
            </dd>
          </CardContent>
          <CardFooter className="hidden justify-end border-t border-border p-0!">
            <a
              href={'#'}
              className="px-6 py-3 text-sm font-medium hover:text-primary/90"
            >
              View more &#8594;
            </a>
          </CardFooter>
        </Card>
      ))}
    </dl>
  );
}
