import dayjs from "dayjs";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import CardWish from "~/interfaces/CardWish";
import { TRPCError } from "@trpc/server";

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

  createWish: privateProcedure
    .input(
      z.object({
        cardId: z.string().cuid(),
        message: z.string().max(300),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hasWish = await ctx.db.wishes.findFirst({
        where: {
          cardId: input.cardId,
          creatorId: ctx.userId,
        },
      });

      if (hasWish)
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "You've already submitted a wish to this card!",
        });

      return await ctx.db.wishes.create({
        data: {
          cardId: input.cardId,
          creatorId: ctx.userId,
          text: input.message,
        },
      });
    }),
});
