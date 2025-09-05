import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { app } from "@/lib/config";

function GlobalNotFoundPage() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Image unoptimized src="/icons/logo.svg" width={40} height={40} alt={app.title} />
      <h1 className="text-xl font-bold">Page Not Found</h1>
      <Button asChild>
        <Link href="/projects">
          Go to Projects <ArrowRightIcon />
        </Link>
      </Button>
    </div>
  );
}

export default GlobalNotFoundPage;
