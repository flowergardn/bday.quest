"use server";

import { db } from "~/server/db/";
import { eq } from "drizzle-orm";
import { cards as cardSchema } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function deleteCard(cardId: string) {
  const [card] = await db
    .select()
    .from(cardSchema)
    .where(eq(cardSchema.id, cardId));

  if (!card) {
    return {
      success: false,
      message: "Card not found",
    };
  }

  const { userId: creatorId } = auth();
  if (creatorId !== card.creatorId) {
    return { success: false, message: "Not authorized" };
  }

  return db.delete(cardSchema).where(eq(cardSchema.id, cardId));
}
