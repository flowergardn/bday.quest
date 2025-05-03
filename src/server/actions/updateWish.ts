"use server";

import { db } from "~/server/db/";
import { eq } from "drizzle-orm";
import { type Wishes, wishes as wishSchema } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";

export type UpdateWishResult =
  | { success: true; data: Wishes }
  | { success: false; error: string };

export const updateWish = async (
  wishId: string,
  wishText: string,
): Promise<UpdateWishResult> => {
  const [wish] = await db
    .select()
    .from(wishSchema)
    .where(eq(wishSchema.id, wishId));

  if (!wish) {
    return { success: false, error: "Wish not found" };
  }

  const { userId: creatorId } = auth();

  if (creatorId !== wish.creatorId) {
    return { success: false, error: "Not authorized" };
  }

  if (wishText.trim().length === 0) {
    return { success: false, error: "You cannot send empty wishes" };
  }

  const [newWish] = await db
    .update(wishSchema)
    .set({
      text: wishText,
    })
    .where(eq(wishSchema.id, wishId))
    .returning();

  if (!newWish) {
    return { success: false, error: "Wish not found" };
  }

  return { success: true, data: newWish };
};
