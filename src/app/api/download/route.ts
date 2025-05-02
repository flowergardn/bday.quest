import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { type NextRequest } from "next/server";
import { db } from "~/server/db";
import { cards, wishes } from "~/server/db/schema";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new Response(JSON.stringify([]));
  }

  const allWishes = await db
    .select({
      cardId: wishes.cardId,
      text: wishes.text,
      createdAt: wishes.createdAt,
    })
    .from(wishes)
    .where(eq(wishes.creatorId, user.id));

  const createdCards = await db
    .select()
    .from(cards)
    .where(eq(cards.creatorId, user.id));

  const data = {
    cards: createdCards,
    wishes: allWishes,
  };

  const jsonData = JSON.stringify(data, null, 2);

  const filename = `user-data-${new Date().toISOString().split("T")[0]}.json`;

  const headers = new Headers();
  headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  headers.set("Content-Type", "application/json");

  return new Response(jsonData, {
    status: 200,
    headers,
  });
}
