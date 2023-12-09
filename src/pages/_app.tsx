import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import fonts from "~/utils/fonts";
import { Toaster } from "react-hot-toast";

const BirthdayQuest: AppType = ({ Component, pageProps }) => {
  return (
    <div className={fonts.satoshi.className}>
      <ClerkProvider>
        <Toaster
          toastOptions={{
            style: {
              background: "#050709",
              color: "#fff",
              textAlign: "center",
            },
            position: "bottom-center",
          }}
        />
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(BirthdayQuest);
