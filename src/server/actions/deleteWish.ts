"use server";

import { db } from "~/server/db/";
import { eq } from "drizzle-orm";
import { wishes as wishSchema } from "~/server/db/schema";

export const deleteWish = async (wishId: string) => {
  await db.delete(wishSchema).where(eq(wishSchema.id, wishId));
  return null;
};
