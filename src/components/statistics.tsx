"use server";

import { sql } from "drizzle-orm";
import { db } from "~/server/db";
import { cards, wishes } from "~/server/db/schema";

async function countRows(table: typeof cards | typeof wishes) {
  const [value] = await db.select({ count: sql<number>`count(*)` }).from(table);
  if (value) return value.count;
  return 0;
}

const Statistics = async () => {
  const cardStats = await countRows(cards);
  const wishStats = await countRows(wishes);

  const cardCount = Intl.NumberFormat("en-US").format(cardStats);
  const wishCount = Intl.NumberFormat("en-US").format(wishStats);

  return (
    <p className="text-center">
      So far, <strong>{cardCount}</strong> cards have been created, and{" "}
      <strong>{wishCount}</strong> wishes have been collected.
    </p>
  );
};

export default Statistics;
