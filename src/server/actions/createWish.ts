"use server";

import { auth } from "@clerk/nextjs/server";
import { typeid } from "typeid-js";
import { db } from "../db";
import { type Wishes, wishes, cards } from "../db/schema";
import { createUser, getUser } from "../db/queries";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const createWishSchema = z.object({
  wish: z.string().trim().min(1, "You cannot send empty wishes"),
});

export type CreateWishResult =
  | { success: true; data: Wishes }
  | { success: false; error: string };

export const createWish = async (
  formData: FormData,
  cardId: string,
): Promise<CreateWishResult> => {
  const { userId: creatorId } = auth();

  if (!creatorId) {
    return { success: false, error: "You must be signed in to add a wish" };
  }

  const user = await getUser(creatorId);
  if (!user) await createUser(creatorId);

  const { success, data, error } = createWishSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!success) {
    return {
      success: false,
      error: error.issues[0]?.message ?? "There was an error creating the wish",
    };
  }

  const [cardData] = await db.select().from(cards).where(eq(cards.id, cardId));

  if (!cardData) {
    return { success: false, error: "Card not found" };
  }

  if (cardData.paused) {
    return { success: false, error: "This card is currently paused" };
  }

  const totalWishes = await db
    .select()
    .from(wishes)
    .where(and(eq(wishes.cardId, cardId), eq(wishes.creatorId, creatorId)));

  if (totalWishes.length >= 3) {
    return { success: false, error: "You've reached your wish limit" };
  }

  const id = typeid("wish").toString();

  let wishData: Wishes;

  try {
    const [wish] = await db
      .insert(wishes)
      .values({
        id,
        creatorId,
        cardId,
        text: data.wish,
        createdAt: new Date(),
      })
      .returning();

    if (!wish) throw new Error("Wish not found");

    wishData = wish;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "There was an error adding this wish to the card",
    };
  }

  return { success: true, data: wishData };
};
