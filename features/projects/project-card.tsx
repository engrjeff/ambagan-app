import { Project } from '@/app/generated/prisma';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { ProjectIcon } from './project-icon';

export function ProjectCard({
  project,
}: {
  project: Project & { totalAmountPaid: number; percentage: number };
}) {
  return (
    <Card className="py-4 hover:bg-background">
      <div className="px-4 flex items-center gap-4">
        <ProjectIcon iconName={project.icon} color={project.color} />
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            {project.title}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {project.description}
          </CardDescription>
        </div>
      </div>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground flex items-center gap-2 pb-2">
          <CalendarIcon className="size-3" />{' '}
          <p>
            {formatDate(project.startDate.toISOString())} -{' '}
            {formatDate(project.endDate.toISOString())}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium font-mono">
            Current: {formatCurrency(project.totalAmountPaid)}
          </p>
          <p className="text-xs font-medium font-mono">
            Target: {formatCurrency(project.targetAmount)}
          </p>
        </div>
        <Progress
          value={project.percentage}
          className="bg-white/10"
          indicatorColor={project.color}
        />
        <p className="text-xs text-muted-foreground font-mono">
          {project.percentage.toFixed(1)}% completed
        </p>
      </CardContent>
    </Card>
  );
}
