import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import Navbar from "~/components/navbar";

export const metadata = {
  title: "bday.quest",
  description: "Create virtual birthday cards",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable} dark`}>
        <body>
          <TooltipProvider>
            <Navbar />
            {children}
            {modal}
          </TooltipProvider>
        </body>
        <Toaster />
      </html>
    </ClerkProvider>
  );
}
