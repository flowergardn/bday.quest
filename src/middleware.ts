import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    // TODO: Clean this up a lot, lol
    "/",
    "/api/trpc/cards.fetch",
    "/api/trpc/cards.getWishes",
    "/api/trpc/cards.getWishes,cards.fetch",
    "/c/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
