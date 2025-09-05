import { type Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/features/projects/project-form";

export const metadata: Metadata = {
  title: "Create Project",
};

function CreateProjectPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4">
      <Button size="sm" variant="link" className="text-foreground px-0 has-[>svg]:px-0" asChild>
        <Link href="/projects">
          <ArrowLeftIcon /> Back
        </Link>
      </Button>
      {/* top bar */}
      <div className="flex items-center">
        <div>
          <h1 className="text-lg font-semibold">Add New Project</h1>
          <p className="text-muted-foreground">Fill in the required details below.</p>
        </div>
        <div className="ml-auto"></div>
      </div>

      <ProjectForm />
    </div>
  );
}

export default CreateProjectPage;
