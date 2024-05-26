// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `bday_${name}`);

export const cards = createTable("cards", {
  id: varchar("id").primaryKey(),
  creatorId: varchar("creatorId")
    .notNull()
    .references(() => user.id, {
      onDelete: "no action",
    }),
  title: varchar("title").notNull(),
  description: varchar("description").default(""),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`now()`),
  birthday: timestamp("birthday").notNull(),
  paused: boolean("paused").default(false),
});

export const wishes = createTable("wishes", {
  id: varchar("id").primaryKey(),
  creatorId: varchar("creatorId")
    .notNull()
    .references(() => user.id, {
      onDelete: "no action",
    }),
  cardId: varchar("cardId")
    .notNull()
    .references(() => cards.id, {
      onDelete: "cascade",
    }),
  text: varchar("text").notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`now()`),
});

export const user = createTable("user", {
  id: varchar("id").primaryKey(),
});
