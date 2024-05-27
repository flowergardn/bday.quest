"use server";

import { db } from "~/server/db/";
import { eq } from "drizzle-orm";
import { type Wishes, wishes as wishSchema } from "~/server/db/schema";

export const updateWish = async (
  wishId: string,
  wishText: string,
): Promise<Wishes | undefined> => {
  const wish = (
    await db.select().from(wishSchema).where(eq(wishSchema.id, wishId))
  ).shift();

  if (!wish) {
    throw new Error("Wish not found");
  }

  const newWish = await db
    .update(wishSchema)
    .set({
      text: wishText,
    })
    .where(eq(wishSchema.id, wishId))
    .returning();
  return newWish.shift();
};
