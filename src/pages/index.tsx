import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Meta from "~/components/Meta";
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
      <Meta title="bday.quest (beta)" />

      <Navbar />
      <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
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
