import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight-new";
import { app } from "@/lib/config";

export default function Home() {
  return (
    <div className="flex h-[80vh] flex-col items-center gap-6 px-4 pt-20">
      <Spotlight />
      <div className="flex flex-col items-center text-center">
        <Image unoptimized src="/icons/logo.svg" width={56} height={56} alt={app.title} />
        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text pb-2 text-center text-6xl font-bold text-transparent md:text-8xl">
          {app.title}
        </h1>
        <p className="mx-auto mt-4 text-center text-lg font-normal text-neutral-300">{app.description}</p>
      </div>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <SignedOut>
          <SignInButton>
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Get Started</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Button asChild size="lg">
            <Link href="/projects">
              My Projects <ArrowRightIcon />
            </Link>
          </Button>
        </SignedIn>
      </div>
    </div>
  );
}
