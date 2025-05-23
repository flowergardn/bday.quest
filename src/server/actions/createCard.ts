"use server";

import { auth } from "@clerk/nextjs/server";
import { typeid } from "typeid-js";
import { db } from "../db";
import { cards } from "../db/schema";
import type CardData from "~/interfaces/CardData";
import { createUser, getUser } from "../db/queries";
import { z } from "zod";

const createCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  birthday: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "That's not a date!",
  }),
});

export type CreateCardResult =
  | { success: true; data: CardData }
  | { success: false; error: string };

export const createCard = async (
  formData: FormData,
): Promise<CreateCardResult> => {
  const { userId: creatorId } = auth();

  if (!creatorId) {
    return { success: false, error: "You must be signed in to create a card" };
  }

  const user = await getUser(creatorId);
  if (!user) await createUser(creatorId);

  const { success, data, error } = createCardSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!success) {
    return {
      success: false,
      error: error.issues[0]?.message ?? "There was an error creating the card",
    };
  }

  const id = typeid("card").toString();

  let cardData: CardData;

  const birthday = new Date(data.birthday);

  if (isNaN(birthday.getTime())) {
    return { success: false, error: "That birthday is not a valid date" };
  }

  try {
    const card = await db
      .insert(cards)
      .values({
        id,
        creatorId,
        title: data.title,
        description: data.description,
        birthday,
        paused: false,
      })
      .returning();
    cardData = card[0] as CardData;
  } catch (error: unknown) {
    console.log(error);
    return { success: false, error: "There was an error creating the card" };
  }

  return { success: true, data: cardData };
};
