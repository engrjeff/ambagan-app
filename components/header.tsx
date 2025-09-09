import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { app } from "@/lib/config";
import { Separator } from "./ui/separator";

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 p-4">
        <Link href="/" className="flex items-center gap-x-1">
          <Image src="/icons/logo.svg" alt={app.title} width={32} height={32} className="object-contain" />
          <span className="font-semibold">{app.title}</span>
        </Link>
        <div className="flex h-full items-center gap-2">
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
            <Separator orientation="vertical" />
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
