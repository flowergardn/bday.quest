import { getCreatedCards } from "~/server/db/queries";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { CardRow, EmptyState } from "./table-components";

export default async function ManageCards() {
  const cards = await getCreatedCards();

  return (
    <div className="container mx-auto mt-[10vh] py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Cards</h1>
            <p className="mt-1 text-sm text-zinc-300">
              You have created {cards.length}{" "}
              {cards.length === 1 ? "card" : "cards"}
            </p>
          </div>
          <Link href="/create">
            <Button size="lg" variant="outline">
              Create Card
            </Button>
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Messages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.length === 0 ? (
              <EmptyState />
            ) : (
              cards.map((card) => <CardRow key={card.id} card={card} />)
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
