import dayjs from "dayjs";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const cardRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  lol: privateProcedure.query(({ ctx }) => {
    return {
      greeting: `Hello ${ctx.userId}`,
    };
  }),

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
});
