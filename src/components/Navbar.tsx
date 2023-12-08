import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { themeChange } from "theme-change";

const Navbar = () => {
  const { isLoaded, user } = useUser();

  useEffect(() => themeChange(false), []);

  const UserDropdown = () => {
    return (
      <>
        <div className="dropdown dropdown-end hidden md:block">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonBox: "scale-125",
                user,
              },
            }}
          />
        </div>
      </>
    );
  };

  return (
    <div className="ml-12 mr-24 bg-transparent md:ml-24 md:block">
      <div className="navbar mx-16 md:mx-0">
        <div className="md:ml-none mr-20 flex-1">
          <div className="mr-4 h-12 w-12">
            <Image
              src={"/Cake.png"}
              width={64}
              height={64}
              alt="A cake emoji"
            />
          </div>
          <Link href={"/"} passHref>
            <button className="btn btn-ghost text-xl normal-case">
              bday.quest
            </button>
          </Link>
        </div>
        <div className="mr-10">
          <select
            data-choose-theme
            className="select w-full max-w-xs"
            defaultValue={"default"}
          >
            <option value="default">Default</option>
            <option value="darkTheme">Lights out</option>
          </select>
        </div>
        <div className="ml-20 flex-none md:ml-0">
          {isLoaded ? <UserDropdown /> : <></>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
