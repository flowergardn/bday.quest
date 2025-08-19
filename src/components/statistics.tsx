"use server";

import { sql } from "drizzle-orm";
import { db } from "~/server/db";
import { cards, wishes } from "~/server/db/schema";

async function countRows(table: typeof cards | typeof wishes): Promise<string> {
  const [value] = await db
    .select({ count: sql<number>`count(id)` })
    .from(table);
  if (value) return Intl.NumberFormat("en-US").format(value.count);
  return "0";
}

const Statistics = async () => {
  return (
    <p className="text-center">
      So far, <strong>{await countRows(cards)}</strong> cards have been created,
      and <strong>{await countRows(wishes)}</strong> wishes have been collected.
    </p>
  );
};

export default Statistics;
