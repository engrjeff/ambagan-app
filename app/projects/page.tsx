import { type Metadata } from "next";
import Link from "next/link";
import { PackageIcon, PlusCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/features/projects/project-card";
import { getProjects } from "@/features/projects/queries";

export const metadata: Metadata = {
  title: "Projects",
};

async function ProjectsPage() {
  const { projects } = await getProjects();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4">
      {/* top bar */}
      <div className="flex items-center">
        <div>
          <h1 className="font-semibold">Projects</h1>
          <p className="text-muted-foreground hidden text-sm md:block">View and manage your projects here.</p>
        </div>
        <div className="ml-auto">
          <Button asChild>
            <Link href="/projects/new">
              <PlusCircleIcon />
              Add Project
            </Link>
          </Button>
        </div>
      </div>

      {/* content */}
      {projects.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-4">
          <PackageIcon className="text-muted-foreground mb-2 size-5" />
          <p className="mb-6 text-center">No projects created yet.</p>

          <Button asChild>
            <Link href="/projects/new">
              <PlusCircleIcon />
              Add Project
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={`project-${project.id}`}>
              <Link href={`/projects/${project.id}`}>
                <ProjectCard project={project} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProjectsPage;
