import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { auth, clerkClient } from "@clerk/nextjs/server";

export default function Navbar() {
  const User = async () => {
    const user = auth();

    if (!user.userId) return <></>;

    const userData = await clerkClient.users.getUser(user.userId);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Avatar>
            <AvatarImage src={userData.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="m-4 w-fit space-x-4 bg-black/60">
          <div className="flex flex-col items-center justify-around">
            {/* <Link href="/signed">
              <Button variant={"ghost"} size="sm">
                View signed cards
              </Button>
            </Link> */}
            <Link href="/manage">
              <Button variant={"ghost"} size="sm">
                Manage cards
              </Button>
            </Link>
            <SignOutButton redirectUrl="/">
              <Button variant={"ghost"} size="sm">
                Log out
              </Button>
            </SignOutButton>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <nav className="fixed top-0 z-10 w-full p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Image src="/Cake.png" width={32} height={32} alt="A cake" />
          </Link>
          <p>bday.quest</p>
        </div>
        <div className="flex items-center space-x-4">
          <User />
        </div>
      </div>
    </nav>
  );
}
