"use client";

import { LockIcon, LockOpenIcon, TrashIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import TooltipButton from "~/components/tooltip-button";
import { toast } from "sonner";
import { deleteCard } from "~/server/actions/deleteCard";
import { pauseCard } from "~/server/actions/pauseCard";

export default function CreatorOptions(props: {
  cardData: {
    cardId: string;
    paused: boolean;
  };
}) {
  function DeleteButton() {
    async function handleDelete() {
      toast("Deleting card...", {
        duration: Infinity,
        id: "delete-begin",
      });

      const data = await deleteCard(props.cardData.cardId);

      toast.dismiss("delete-begin");

      if (!data.success) {
        toast(data.message);
        return;
      }

      toast(`Card deleted!`);

      setTimeout(() => {
        location.href = "/";
      }, 1500);
    }

    return (
      <form action={handleDelete}>
        <TooltipButton tooltip="Delete card">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-500"
            type="submit"
          >
            <TrashIcon />
          </Button>
        </TooltipButton>
      </form>
    );
  }

  function LockButton() {
    async function handleLock() {
      toast("Locking card...", {
        duration: Infinity,
        id: "lock-begin",
      });

      const pauseData = await pauseCard(props.cardData.cardId);

      if (pauseData.success === false) {
        toast(pauseData.message);
        return;
      }

      toast.dismiss("lock-begin");
      toast(`Card is now ${pauseData.paused ? "locked" : "unlocked"}!`);
    }

    return (
      <form action={handleLock}>
        <TooltipButton
          tooltip={props.cardData.paused ? "Unlock card" : "Lock card"}
        >
          <Button variant="ghost" size="sm" type="submit">
            {props.cardData.paused ? <LockIcon /> : <LockOpenIcon />}
          </Button>
        </TooltipButton>
      </form>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="lg">
          Options
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit space-x-4 bg-black/60">
        Card creator options
        <section className="mt-4 flex flex-row items-center justify-around">
          <DeleteButton />
          <LockButton />
        </section>
      </PopoverContent>
    </Popover>
  );
}
