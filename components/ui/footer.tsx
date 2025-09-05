import { app } from '@/lib/config';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t p-4">
      <div className="max-w-6xl mx-auto text-sm text-muted-foreground flex flex-col md:flex-row md:items-center gap-2">
        <Image
          unoptimized
          src="/icons/logo.svg"
          width={20}
          height={20}
          alt={app.title}
        />
        <p>
          {app.title}. Copyright &copy; {new Date().getFullYear()}
        </p>
        <p className="md:ml-auto mt-6 md:mt-0">
          Made by{' '}
          <a
            href="http://jeffsegovia.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-semibold text-primary"
          >
            Jeff Segovia
          </a>
        </p>
      </div>
    </footer>
  );
}
