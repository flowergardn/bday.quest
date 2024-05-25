"use server";

import { db } from "~/server/db";
import { cards } from "~/server/db/schema";

const Statistics = async () => {
  const cardStats = await db.select().from(cards);
  const cardCount = Intl.NumberFormat("en-US").format(cardStats.length);
  return (
    <p className="text-center">There are {cardCount} cards created so far!</p>
  );
};

export default Statistics;
