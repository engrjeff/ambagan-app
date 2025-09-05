import Image from "next/image";

import { app } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t p-4">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-2 text-sm md:flex-row md:items-center">
        <Image unoptimized src="/icons/logo.svg" width={20} height={20} alt={app.title} />
        <p>
          {app.title}. Copyright &copy; {new Date().getFullYear()}
        </p>
        <p className="mt-6 md:mt-0 md:ml-auto">
          Made by{" "}
          <a
            href="http://jeffsegovia.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            Jeff Segovia
          </a>
        </p>
      </div>
    </footer>
  );
}
