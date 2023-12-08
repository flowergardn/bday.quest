import { SignInButton, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import Navbar from "~/components/Navbar";

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
      <div className="flex w-full text-slate-800">
        <button className="grid flex-grow place-items-center rounded-box bg-primary  p-3">
          <Link href={"/create"}>Create</Link>
        </button>
        <div className="divider divider-horizontal"></div>
        <button className="grid flex-grow place-items-center rounded-box bg-primary p-3">
          <Link href={"/manage"}>Manage</Link>
        </button>
      </div>
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

      <Navbar />
      <div className="hero min-h-screen bg-base-200">
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
