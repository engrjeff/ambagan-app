import { CalendarIcon } from "lucide-react";

import { Project } from "@/app/generated/prisma";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ProjectIcon } from "./project-icon";

export function ProjectCard({ project }: { project: Project & { totalAmountPaid: number; percentage: number } }) {
  return (
    <Card className="hover:bg-background py-4">
      <div className="flex items-center gap-4 px-4">
        <ProjectIcon iconName={project.icon} color={project.color} />
        <div className="space-y-0">
          <CardTitle className="flex items-center gap-2 text-sm">{project.title}</CardTitle>
          <CardDescription className="line-clamp-1">{project.description}</CardDescription>
        </div>
      </div>
      <CardContent className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-2 pb-2 text-xs">
          <CalendarIcon className="size-3" />{" "}
          <p>
            {formatDate(project.startDate.toISOString())} - {formatDate(project.endDate.toISOString())}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-xs font-medium">Current: {formatCurrency(project.totalAmountPaid)}</p>
          <p className="font-mono text-xs font-medium">Target: {formatCurrency(project.targetAmount)}</p>
        </div>
        <Progress value={project.percentage} className="bg-white/10" indicatorColor={project.color} />
        <p className="text-muted-foreground font-mono text-xs">{project.percentage.toFixed(1)}% completed</p>
      </CardContent>
    </Card>
  );
}
