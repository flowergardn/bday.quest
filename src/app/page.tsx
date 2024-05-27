import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Statistics from "~/components/statistics";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <Image src={"/Cake.png"} width={96} height={96} alt="A cake" />
        </div>
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold">bday.quest</h1>
          <p className="py-6">
            Birthday cards are awesome, let&apos;s virtualize them.
          </p>
          <Statistics />
        </div>
        <div className="flex flex-row items-center justify-center gap-6">
          <SignedIn>
            <Link href="/create">
              <Button size="lg">Create</Button>
            </Link>
            <Link href="/manage">
              <Button size="lg" variant="secondary">
                Manage
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button size="lg">Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </main>
  );
}
