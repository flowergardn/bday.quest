import dayjs from "dayjs";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import CardWish from "~/pages/interfaces/CardWish";

export const cardRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().max(256).default(""),
        birthday: z.string().datetime(),
        showAge: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const card = await ctx.db.cards.create({
        data: {
          birthday: input.birthday,
          title: input.title,
          description: input.description,
          creatorId: ctx.userId,
        },
      });

      return {
        id: card.id,
      };
    }),

  fetch: privateProcedure
    .input(
      z.object({
        cardId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const card = await ctx.db.cards.findUnique({
        where: {
          id: input.cardId,
        },
      });

      return card;
    }),

  getWishes: privateProcedure
    .input(
      z.object({
        cardId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const wishes = await ctx.db.wishes.findMany({
        where: {
          cardId: input.cardId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const parsedWishes = await Promise.all(
        wishes.map(async (wish) => {
          const user = await clerkClient.users.getUser(wish.creatorId);
          const newWish: CardWish = {
            ...wish,
            profilePicture: user.imageUrl,
            username: user.username ?? user.id,
          };
          return newWish;
        }),
      );

      return parsedWishes;
    }),
});
