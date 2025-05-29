import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getCard } from "~/server/db/queries";

export default async function CardEdit({
  params: { id: cardId },
}: {
  params: { id: string };
}) {
  const cardData = await getCard(cardId);
  const user = auth();
  if (!cardData) notFound();
  if (!user || user.userId !== cardData.creatorId) redirect("/");

  return (
    <div className="container mx-auto mt-[10vh] py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Header section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Card</h1>
            <p className="text-md mt-1 text-zinc-400">{cardData.title}</p>
          </div>
          <Link href={`/c/${cardData.id}`}>
            <Button size="lg" variant="outline">
              View Card
            </Button>
          </Link>
        </div>

        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>

        <div className="flex flex-row gap-4"></div>
      </div>
    </div>
  );
}
