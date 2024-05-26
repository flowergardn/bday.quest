import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Signatures from "~/components/signatures";
import { Button } from "~/components/ui/button";
import { getCard, getWishes } from "~/server/db/queries";

export default async function CardView({
  params: { id: cardId },
}: {
  params: { id: string };
}) {
  const cardData = await getCard(cardId);
  const user = auth();

  if (!cardData) {
    return <div>Card not found</div>;
  }

  const wishes = await getWishes(cardId);

  const SignCard = () => {
    if (cardData.paused) {
      return (
        <div className="tooltip tooltip-bottom" data-tip="Wishes are disabled">
          <Button size="lg" variant="secondary" disabled>
            Sign
          </Button>
        </div>
      );
    }

    return (
      <Link href={`/c/${cardData.id}/sign`}>
        <Button variant="default">Sign</Button>
      </Link>
    );
  };

  return (
    <div className="bg-base-100 flex min-h-screen flex-col items-center">
      <div className="mb-12 mt-20 w-full max-w-sm shrink-0 p-6">
        <article className="prose prose-dark">
          <h1>{cardData.title}</h1>
          <p>{cardData.description}</p>
        </article>
      </div>
      <div className="mb-4 flex max-w-xl shrink-0 flex-col items-center p-6">
        <Signatures currentUser={user.userId} signatures={wishes} />
        <SignCard />
      </div>
    </div>
  );
}
