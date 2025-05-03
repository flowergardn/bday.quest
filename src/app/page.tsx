import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Statistics from "~/components/statistics";
import { Button } from "~/components/ui/button";
import { Cake, PartyPopper, PenLine } from "lucide-react";

export default function HomePage() {
  const steps = [
    {
      icon: <Cake className="h-8 w-8 text-pink-400" />,
      title: "Create your card",
      description:
        "It only takes a minute to create a birthday card that everyone can sign.",
    },
    {
      icon: <PenLine className="h-8 w-8 text-blue-400" />,
      title: "Collect wishes",
      description:
        "Send the card to anyone via the link, and they can sign it with their own personalized birthday messages.",
    },
    {
      icon: <PartyPopper className="h-8 w-8 text-yellow-400" />,
      title: "Celebrate together",
      description:
        "On their special day, reveal the card filled with all of the messages!",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col text-white">
      <section className="relative flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="relative flex flex-col items-center ">
          <div className="mb-6 rounded-full p-4">
            <Image
              src="/Cake.png"
              width={100}
              height={100}
              alt="Birthday cake"
              className="animate-pulse"
            />
          </div>

          <h1 className="mb-4 h-[10vh] bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-6xl text-transparent sm:text-7xl md:h-[9vh]">
            bday.quest
          </h1>

          <p className="mb-8 max-w-md text-xl text-gray-300">
            Birthday cards are awesome, let&apos;s virtualize them.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <SignedIn>
              <Link href="/create">
                <Button size="lg">Create a Card</Button>
              </Link>
              <Link href="/manage">
                <Button size="lg" variant="secondary">
                  Manage Your Cards
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button size="lg">Get Started</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <div className="rounded-xl bg-white/5 px-8 py-4 backdrop-blur-sm">
          <Statistics />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Three simple steps
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl bg-white/5 p-6 text-center transition-all duration-300 hover:bg-white/10"
            >
              <div className="mb-4 rounded-full bg-gray-800 p-4">
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
