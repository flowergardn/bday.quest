"use server";

import { auth } from "@clerk/nextjs/server";
import { typeid } from "typeid-js";
import { db } from "../db";
import { Wishes, wishes } from "../db/schema";

export const createWish = async (formData: FormData, cardId: string) => {
  const { userId: creatorId } = auth();

  if (!creatorId) {
    throw new Error("You must be signed in to add a wish");
  }

  const id = typeid("wish").toString();

  let wishData: Wishes;

  try {
    const wish = await db
      .insert(wishes)
      .values({
        id,
        creatorId,
        cardId,
        text: formData.get("wish") as string,
        createdAt: new Date(),
      })
      .returning();
    wishData = wish[0] as Wishes;
  } catch (error) {
    console.log(error);
    throw new Error("There was an error adding this wish to the card");
  }

  return wishData;
};
