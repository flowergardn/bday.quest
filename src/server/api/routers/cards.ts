import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type CardWish from "~/interfaces/CardWish";
import { TRPCError } from "@trpc/server";

const checkFalsy = (...values: (string | boolean | null | undefined)[]) =>
  values.every((value) => value === null);

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
      // Creates the user if it doesn't exist
      // Could probably use clerk webhooks, but
      // this is more of a solid approach.

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.userId,
        },
      });

      if (!user) {
        await ctx.db.user.create({
          data: {
            id: ctx.userId,
          },
        });
      }

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

  edit: privateProcedure
    .input(
      z.object({
        cardId: z.string().cuid(),
        title: z.string().nullish(),
        description: z.string().nullish(),
        paused: z.boolean().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const card = await ctx.db.cards.findUnique({
        where: {
          id: input.cardId,
          creatorId: ctx.userId,
        },
      });

      if (!card)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      if (checkFalsy(input.title, input.description, input.paused))
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "No valid options specified.",
        });

      const update: {
        title?: string;
        description?: string;
        paused?: boolean;
      } = {};

      if (input.title) update.title = input.title;
      if (input.description) update.description = input.description;
      if (input.paused !== null) update.paused = input.paused;

      return await ctx.db.cards.update({
        where: {
          id: input.cardId,
        },
        data: update,
      });
    }),

  fetch: publicProcedure
    .input(
      z.object({
        cardId: z.string().cuid(),
        requireOwner: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const card = await ctx.db.cards.findUnique({
        where: {
          id: input.cardId,
        },
      });

      if (card && input.requireOwner) {
        if (card.creatorId !== ctx.userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't own this card :(",
          });
        }
      }

      return card;
    }),

  delete: privateProcedure
    .input(
      z.object({
        cardId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const card = await ctx.db.cards.findUnique({
        where: {
          id: input.cardId,
          creatorId: ctx.userId,
        },
      });

      if (!card)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return await ctx.db.cards.delete({
        where: {
          id: input.cardId,
        },
      });
    }),

  fetchAll: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.cards.findMany({
      where: {
        creatorId: ctx.userId,
      },
    });
  }),

  getWishes: publicProcedure
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
          createdAt: "desc",
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
      const cardInfo = await ctx.db.cards.findUnique({
        where: {
          id: input.cardId,
        },
      });

      if (!cardInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: "You cannot send a wish to an inexistent card!",
        });
      }
      const hasWish = await ctx.db.wishes.findFirst({
        where: {
          cardId: input.cardId,
          creatorId: ctx.userId,
        },
      });

      if (hasWish) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "You've already submitted a wish to this card!",
        });
      }

      if (cardInfo.paused) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "Wishes can no longer be submitted to this card!",
        });
      }

      return await ctx.db.wishes.create({
        data: {
          cardId: input.cardId,
          creatorId: ctx.userId,
          text: input.message,
        },
      });
    }),

  deleteWish: privateProcedure
    .input(
      z.object({
        cardId: z.string().cuid(),
        wishId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const card = await ctx.db.cards.findUnique({
        where: {
          id: input.cardId,
          creatorId: ctx.userId,
        },
      });

      if (!card)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return await ctx.db.wishes.delete({
        where: {
          id: input.wishId,
        },
      });
    }),
});
