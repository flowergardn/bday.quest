import { desc, eq } from "drizzle-orm";
import { db } from ".";
import { Card, cards as cardSchema, wishes as wishSchema } from "./schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import CardWish from "~/interfaces/CardWish";
import CardData, { CardDataWithWishes } from "~/interfaces/CardData";

export async function getCard(id: string): Promise<Card> {
  const cards = await db.select().from(cardSchema).where(eq(cardSchema.id, id));
  return cards.shift() as Card;
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

export async function getCreatedCards(): Promise<CardDataWithWishes[]> {
  const user = auth();
  if (!user.userId) return [];
  const cards: CardData[] = await db
    .select()
    .from(cardSchema)
    .where(eq(cardSchema.creatorId, user.userId));

  const newCards = await Promise.all(
    cards.map(async (card) => {
      const wishes = await db
        .select()
        .from(wishSchema)
        .where(eq(wishSchema.cardId, card.id))
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

      const newCard: CardDataWithWishes = {
        ...card,
        wishes: parsedWishes,
      };

      return newCard;
    }),
  );

  return newCards;
}
