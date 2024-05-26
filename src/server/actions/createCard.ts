"use server";

import { auth } from "@clerk/nextjs/server";
import { typeid } from "typeid-js";
import { db } from "../db";
import { cards } from "../db/schema";
import type CardData from "~/interfaces/CardData";

export const createCard = async (formData: FormData) => {
  const { userId: creatorId } = auth();

  if (!creatorId) {
    throw new Error("You must be signed in to create a card");
  }

  const id = typeid("card").toString();

  let cardData: CardData;

  try {
    const card = await db
      .insert(cards)
      .values({
        id,
        creatorId,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        birthday: new Date(),
        paused: false,
      })
      .returning();
    cardData = card[0] as CardData;
  } catch (error) {
    console.log(error);
    throw new Error("There was an error creating the card");
  }

  return cardData;
};
