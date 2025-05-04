import { desc, eq, inArray } from "drizzle-orm";
import { db } from ".";
import {
  type User,
  cards as cardSchema,
  wishes as wishSchema,
  users as userSchema,
} from "./schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
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

  const uniqueUserIds = [...new Set(wishes.map((wish) => wish.creatorId))];

  const usersData =
    uniqueUserIds.length > 0
      ? (await clerkClient.users.getUserList({ userId: uniqueUserIds })).data
      : [];

  const userMap: Record<string, { imageUrl: string; username: string }> = {};
  usersData.forEach((user) => {
    userMap[user.id] = {
      imageUrl: user.imageUrl,
      username: user.username ?? user.id,
    };
  });

  const parsedWishes = await Promise.all(
    wishes.map(async (wish) => {
      const userData = userMap[wish.creatorId];
      return {
        ...wish,
        profilePicture: userData?.imageUrl ?? "",
        username: userData?.username ?? wish.creatorId,
      };
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

  if (cards.length === 0) return [];

  const cardIds = cards.map((card) => card.id);
  const allWishes = await db
    .select()
    .from(wishSchema)
    .where(inArray(wishSchema.cardId, cardIds))
    .orderBy(desc(wishSchema.createdAt));

  const wishesMap: Record<string, typeof allWishes> = {};
  allWishes.forEach((wish) => {
    if (!wishesMap[wish.cardId]) {
      wishesMap[wish.cardId] = [];
    }
    wishesMap[wish.cardId]?.push(wish);
  });

  const uniqueUserIds = [...new Set(allWishes.map((wish) => wish.creatorId))];

  const usersData =
    uniqueUserIds.length > 0
      ? (await clerkClient.users.getUserList({ userId: uniqueUserIds })).data
      : [];

  const userMap: Record<string, { imageUrl: string; username: string }> = {};
  usersData.forEach((user) => {
    userMap[user.id] = {
      imageUrl: user.imageUrl,
      username: user.username ?? user.id,
    };
  });

  const cardsWithWishes: CardDataWithWishes[] = cards.map((card) => {
    const cardWishes = wishesMap[card.id] ?? [];
    const parsedWishes = cardWishes.map((wish) => {
      const userData = userMap[wish.creatorId];
      return {
        ...wish,
        profilePicture: userData?.imageUrl ?? "",
        username: userData?.username ?? wish.creatorId,
      };
    });

    return {
      ...card,
      wishes: parsedWishes,
    };
  });

  return cardsWithWishes;
}

export async function createUser(userId: string) {
  const user: User = {
    id: userId,
  };
  await db.insert(userSchema).values(user);
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
