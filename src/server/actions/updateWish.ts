"use server";

import { db } from "~/server/db/";
import { eq } from "drizzle-orm";
import { type Wishes, wishes as wishSchema } from "~/server/db/schema";

export type UpdateWishResult =
  | { success: true; data: Wishes }
  | { success: false; error: string };

export const updateWish = async (
  wishId: string,
  wishText: string,
): Promise<UpdateWishResult> => {
  if (wishText.trim().length === 0) {
    return { success: false, error: "You cannot send empty wishes" };
  }

  const newWish = await db
    .update(wishSchema)
    .set({
      text: wishText,
    })
    .where(eq(wishSchema.id, wishId))
    .returning();
  if (newWish.length === 0) {
    return { success: false, error: "Wish not found" };
  }
  return { success: true, data: newWish[0] as Wishes };
};
