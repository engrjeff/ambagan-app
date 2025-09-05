import { Button } from '@/components/ui/button';
import { Spotlight } from '@/components/ui/spotlight-new';
import { app } from '@/lib/config';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-[90vh] overflow-hidden flex flex-col gap-6 items-center justify-center">
      <Spotlight />
      <div>
        <h1 className="text-4xl pb-2 md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          {app.title}
        </h1>
        <p className="mt-4 font-normal text-lg text-neutral-300 text-center mx-auto">
          {app.description}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <SignedOut>
          <SignInButton>
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Get Started</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Button asChild>
            <Link href="/projects">
              My Projects <ArrowRightIcon />
            </Link>
          </Button>
        </SignedIn>
      </div>
    </div>
  );
}
