import { desc, eq } from "drizzle-orm";
import { db } from ".";
import { cards as cardSchema, wishes as wishSchema } from "./schema";
import { clerkClient } from "@clerk/nextjs/server";
import CardWish from "~/interfaces/CardWish";

export async function getCard(id: string) {
  const cards = await db.select().from(cardSchema).where(eq(cardSchema.id, id));
  return cards.shift();
}

export async function getWishes(cardId: string) {
  const wishes = await db
    .select()
    .from(wishSchema)
    .where(eq(wishSchema.cardId, cardId))
    .orderBy(desc(wishSchema.createdAt));

  const parsedWishes = await Promise.all(
    wishes.map(async (wish) => {
      const user = await clerkClient.users.getUser(wish.creatorId);
      const newWish: CardWish = {
        ...wish,
        profilePicture: user.imageUrl,
        username: user.username ?? user.id,
      };
      return newWish;
    }),
  );

  return parsedWishes;
}
