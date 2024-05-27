import { desc, eq } from "drizzle-orm";
import { db } from ".";
import {
  User,
  cards as cardSchema,
  wishes as wishSchema,
  users as userSchema,
} from "./schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type CardWish from "~/interfaces/CardWish";
import type CardData from "~/interfaces/CardData";
import { type CardDataWithWishes } from "~/interfaces/CardData";

export async function getCard(id: string): Promise<CardData> {
  const cards = await db.select().from(cardSchema).where(eq(cardSchema.id, id));
  return cards.shift() as CardData;
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

export async function createUser(userId: string) {
  const user: User = {
    id: userId,
  };
  return user;
}

export async function getUser(userId: string): Promise<User | null> {
  const user = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.id, userId));
  if (user.length === 0) return null;
  return user[0] as User;
}
