import { desc, eq } from "drizzle-orm";
import { db } from ".";
import {
  type User,
  cards as cardSchema,
  wishes as wishSchema,
  users as userSchema,
} from "./schema";
import type { User as ClerkUser } from "@clerk/backend";
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

  const userIds = [...new Set(wishes.map((wish) => wish.creatorId))];

  const batchSize = 100;
  const userMap = new Map<string, ClerkUser>();

  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);

    const userBatch = await clerkClient.users.getUserList({
      userId: batch,
      limit: batchSize,
    });

    userBatch.data.forEach((user) => {
      userMap.set(user.id, user);
    });
  }

  const parsedWishes = await Promise.all(
    wishes.map(async (wish) => {
      const user = userMap.get(wish.creatorId);
      if (!user)
        throw new Error(`User not found: ${wish.creatorId} (${wish.id})`);

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
      const wishes = await getWishes(card.id);

      return {
        ...card,
        wishes,
      };
    }),
  );

  return newCards;
}

export async function createUser(userId: string) {
  return await db
    .insert(userSchema)
    .values({
      id: userId,
    })
    .returning();
}

export async function getUser(userId: string): Promise<User | null> {
  const user = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.id, userId));
  if (user.length === 0) return null;
  return user[0] as User;
}
