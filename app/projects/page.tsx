import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/features/projects/project-card';
import { getProjects } from '@/features/projects/queries';
import { PackageIcon, PlusCircleIcon } from 'lucide-react';
import { type Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects',
};

async function ProjectsPage() {
  const { projects } = await getProjects();

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* top bar */}
      <div className="flex items-center">
        <div>
          <h1 className="font-semibold text-lg">Projects</h1>
          <p className="text-muted-foreground">
            View and manage your projects here.
          </p>
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
        <div className="p-4 flex flex-col h-[300px] border border-dashed rounded-md items-center justify-center">
          <PackageIcon className="size-5 text-muted-foreground mb-2" />
          <p className="text-center mb-6">No projects created yet.</p>

          <Button asChild>
            <Link href="/projects/new">
              <PlusCircleIcon />
              Add Project
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
