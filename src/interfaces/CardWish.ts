import { Wishes } from "~/server/db/schema";

export default interface CardWish extends Wishes {
  profilePicture: string;
  username: string;
}
