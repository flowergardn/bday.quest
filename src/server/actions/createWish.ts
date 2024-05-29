"use server";

import { auth } from "@clerk/nextjs/server";
import { typeid } from "typeid-js";
import { db } from "../db";
import { type Wishes, wishes } from "../db/schema";
import { createUser, getUser } from "../db/queries";
import { and, eq } from "drizzle-orm";

export const createWish = async (formData: FormData, cardId: string) => {
  const { userId: creatorId } = auth();

  if (!creatorId) {
    throw new Error("You must be signed in to add a wish");
  }

  const user = await getUser(creatorId);
  if (!user) await createUser(creatorId);

  const totalWishes = await db
    .select()
    .from(wishes)
    .where(and(eq(wishes.cardId, cardId), eq(wishes.creatorId, creatorId)));

  if (totalWishes.length >= 3) {
    throw new Error("You've reached your wish limit");
  }

  const id = typeid("wish").toString();

  let wishData: Wishes;

  try {
    const wish = await db
      .insert(wishes)
      .values({
        id,
        creatorId,
        cardId,
        text: formData.get("wish") as string,
        createdAt: new Date(),
      })
      .returning();
    wishData = wish[0] as Wishes;
  } catch (error) {
    console.log(error);
    throw new Error("There was an error adding this wish to the card");
  }

  return wishData;
};
