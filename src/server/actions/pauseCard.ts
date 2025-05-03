"use server";

import { db } from "~/server/db/";
import { eq, not } from "drizzle-orm";
import { cards as cardSchema } from "~/server/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export const pauseCard = async (cardId: string) => {
  const [card] = await db
    .select()
    .from(cardSchema)
    .where(eq(cardSchema.id, cardId));

  if (!card) {
    return { success: false, message: "Card not found" };
  }

  const { userId: creatorId } = auth();

  if (creatorId !== card.creatorId) {
    return { success: false, message: "Not authorized" };
  }

  const [newCard] = await db
    .update(cardSchema)
    .set({
      paused: not(cardSchema.paused),
    })
    .where(eq(cardSchema.id, cardId))
    .returning();

  revalidatePath("/", "layout");

  return newCard?.paused;
};
