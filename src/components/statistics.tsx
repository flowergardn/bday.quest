"use server";

import { db } from "~/server/db";
import { cards, wishes } from "~/server/db/schema";

const Statistics = async () => {
  const cardStats = await db.select().from(cards);
  const wishStats = await db.select().from(wishes);

  const cardCount = Intl.NumberFormat("en-US").format(cardStats.length);
  const wishCount = Intl.NumberFormat("en-US").format(wishStats.length);

  return (
    <p className="text-center">
      So far, <strong>{cardCount}</strong> cards have been created, and{" "}
      <strong>{wishCount}</strong> wishes have been collected.
    </p>
  );
};

export default Statistics;
