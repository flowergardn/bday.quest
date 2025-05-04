"use client";

import { type CardDataWithWishes } from "~/interfaces/CardData";
import { TableRow, TableCell } from "~/components/ui/table";

export const EmptyState = () => {
  return (
    <TableRow>
      <TableCell colSpan={3} className="py-8 text-center text-zinc-400">
        You haven&apos;t created any cards yet
      </TableCell>
    </TableRow>
  );
};

const CardDescription = ({ description }: { description: string | null }) => {
  if (!description) {
    return <span className="italic text-zinc-500">No description</span>;
  }

  return (
    <span>
      {description.length > 50
        ? `${description.substring(0, 50)}...`
        : description}
    </span>
  );
};

export const CardRow = ({ card }: { card: CardDataWithWishes }) => {
  return (
    <TableRow
      key={card.id}
      className="text-zinc-300 hover:cursor-pointer"
      onClick={() => {
        location.href = `/c/${card.id}`;
      }}
    >
      <TableCell>
        <span>{card.title}</span>
      </TableCell>
      <TableCell>
        <CardDescription description={card.description} />
      </TableCell>
      <TableCell className="text-right">{card.wishes.length}</TableCell>
    </TableRow>
  );
};
