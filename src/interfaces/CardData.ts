import CardWish from "./CardWish";

export default interface CardData {
  id: string;
  creatorId: string;
  createdAt: Date;
  title: string;
  description: string | null;
  birthday: Date;
  paused: boolean;
}

export interface CardDataWithWishes extends CardData {
  wishes: CardWish[];
}
