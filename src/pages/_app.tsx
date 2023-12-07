import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import fonts from "~/utils/fonts";

const BirthdayQuest: AppType = ({ Component, pageProps }) => {
  return (
    <div className={fonts.satoshi.className}>
      <ClerkProvider>
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(BirthdayQuest);
