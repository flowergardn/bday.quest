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
        description: z.string().max(256).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {}),
});
