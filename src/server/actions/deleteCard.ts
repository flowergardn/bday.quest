"use server";

import { db } from "~/server/db/";
import { eq } from "drizzle-orm";
import { cards as cardSchema } from "~/server/db/schema";

export const deleteCard = async (cardId: string) => {
  await db.delete(cardSchema).where(eq(cardSchema.id, cardId));
};
