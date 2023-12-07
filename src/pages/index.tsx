import { SignInButton, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();

  const CTA = () => {
    if (!isLoaded || !isSignedIn) {
      return (
        <SignInButton redirectUrl="/create">
          <button className="btn btn-primary">Login</button>
        </SignInButton>
      );
    }

    return (
      <Link href={"/create"}>
        <button className="btn btn-primary">Create</button>
      </Link>
    );
  };

  return (
    <>
      <Head>
        <title>bday.quest</title>
        <meta
          name="description"
          content="Create custom birthday cards for your friends."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">bday.quest</h1>
            <p className="py-6">
              Birthday cards are awesome, let's virtualize them.
            </p>
            <CTA />
          </div>
        </div>
      </div>
    </>
  );
}
