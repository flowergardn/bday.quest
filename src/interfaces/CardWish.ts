import { Wishes } from "@prisma/client";

export default interface CardWish extends Wishes {
  profilePicture: string;
  username: string;
}
