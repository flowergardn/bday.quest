"use server";

import { db } from "~/server/db/";
import { eq } from "drizzle-orm";
import { wishes as wishSchema } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";

export const deleteWish = async (wishId: string) => {
  const [wish] = await db
    .select()
    .from(wishSchema)
    .where(eq(wishSchema.id, wishId));

  if (!wish) {
    return { success: false, message: "Wish not found" };
  }

  const { userId: creatorId } = auth();

  if (creatorId !== wish.creatorId) {
    return { success: false, message: "Not authorized" };
  }

  await db.delete(wishSchema).where(eq(wishSchema.id, wishId));
  return null;
};
