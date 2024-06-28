import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import Navbar from "~/components/navbar";
import { Viewport } from "next";
import Script from "next/script";

export const metadata = {
  title: "bday.quest (beta)",
  description: "Create virtual birthday cards",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "bday.quest",
    description: "Create virtual birthday cards",
    url: "https://bday.quest",
    siteName: "Birthday Quest",
    images: [
      {
        url: "https://bday.quest/Cake.png",
        width: 128,
        height: 128,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@astridlol",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFB3F4",
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
        <Script
          data-domain="bday.quest"
          defer
          src="https://analytics.astrid.sh/js/script.js"
        />
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
