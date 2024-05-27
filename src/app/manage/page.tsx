import { getCreatedCards } from "~/server/db/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CardDataWithWishes } from "~/interfaces/CardData";
import Link from "next/link";
import Form from "./_components/Form";

export default async function ManageCards() {
  const cards = await getCreatedCards();

  const CreatedCard = (props: { card: CardDataWithWishes }) => {
    const wishes = props.card.wishes;
    const properText = wishes.length === 1 ? "wish" : "wishes";

    return (
      <Card className="m-4 w-[350px] bg-black/60">
        <CardHeader>
          <CardTitle>{props.card.title}</CardTitle>
          <CardDescription>{props.card.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {props.card.wishes.length} total {properText}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Form cardId={props.card.id} />
          <Link href={`/c/${props.card.id}`}>
            <Button>View</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <section className="relative">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CreatedCard card={card} key={card.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
