import { type Viewport } from "next";
import { getCard } from "~/server/db/queries";

export const viewport: Viewport = {
  themeColor: "#FFB3F4",
};

export async function generateMetadata({
  params: { id: cardId },
}: {
  params: { id: string };
}) {
  const cardData = await getCard(cardId);

  return {
    title: "bday.quest (beta)",
    description: `${cardData.title} - ${cardData.description}`,
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    openGraph: {
      title: "bday.quest (beta)",
      description: `${cardData.title} \n\n ${cardData.description}`,
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
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
