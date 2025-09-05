import { Button } from '@/components/ui/button';
import { app } from '@/lib/config';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function ProjectNotFoundPage() {
  return (
    <div className="text-center h-[60vh] flex flex-col items-center justify-center gap-4">
      <Image
        unoptimized
        src="/icons/logo.svg"
        width={40}
        height={40}
        alt={app.title}
      />
      <h1 className="text-xl font-bold">Project Not Found</h1>
      <Button asChild>
        <Link href="/projects">
          Go to Projects <ArrowRightIcon />
        </Link>
      </Button>
    </div>
  );
}

export default ProjectNotFoundPage;
