import { Button } from '@/components/ui/button';
import { app } from '@/lib/config';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b">
      <div className="flex max-w-6xl w-full mx-auto h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-x-1">
          <Image
            src="/icons/logo.svg"
            alt={app.title}
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-semibold">{app.title}</span>
        </Link>
        <div className="flex items-center gap-x-4">
          <SignedOut>
            <SignInButton>
              <Button variant="ghost">Sign in</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button asChild>
              <Link href="/projects">My Projects</Link>
            </Button>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
