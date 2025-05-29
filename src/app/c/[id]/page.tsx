import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Signatures from "./signatures/signatures";
import { Button } from "~/components/ui/button";
import { getCard, getWishes } from "~/server/db/queries";
import { TooltipProvider } from "~/components/ui/tooltip";
import TooltipButton from "~/components/tooltip-button";
import CreatorOptions from "./creator-options";
import { notFound } from "next/navigation";

export default async function CardView({
  params: { id: cardId },
}: {
  params: { id: string };
}) {
  const cardData = await getCard(cardId);
  const user = auth();

  if (!cardData) notFound();

  const wishes = await getWishes(cardId);

  function SignCard() {
    if (cardData.paused) {
      return (
        <TooltipButton tooltip="Wishes are disabled">
          <Button size="lg" variant="secondary" disabled>
            Sign
          </Button>
        </TooltipButton>
      );
    }

    return (
      <Link href={`/c/${cardData.id}/sign`}>
        <Button variant="default" size="lg">
          Sign
        </Button>
      </Link>
    );
  }

  return (
    <div className="bg-base-100 flex min-h-screen flex-col items-center">
      <div className="mb-12 mt-20 w-full max-w-sm shrink-0 p-6">
        <article className="prose prose-dark">
          <h1>{cardData.title}</h1>
          <p>{cardData.description}</p>
        </article>
      </div>
      <div className="mb-4 flex max-w-xl shrink-0 flex-col items-center p-6">
        <Signatures
          currentUser={user.userId}
          signatures={wishes}
          card={cardData}
        />
        <section className="mt-4 flex flex-row items-center justify-center gap-4">
          <TooltipProvider>
            <SignCard />
            {cardData.creatorId === user.userId && (
              <CreatorOptions
                cardData={{
                  cardId: cardData.id,
                  paused: cardData.paused,
                }}
              />
            )}
          </TooltipProvider>
        </section>
      </div>
    </div>
  );
}
