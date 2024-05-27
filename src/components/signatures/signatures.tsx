"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import CardWish from "~/interfaces/CardWish";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { EditWishDialog } from "./manage";
import CardData from "~/interfaces/CardData";
import { deleteWish } from "~/server/actions/deleteWish";
import { toast } from "sonner";

const Signatures = ({
  signatures,
  currentUser,
  card,
}: {
  signatures: CardWish[];
  card: CardData;
  currentUser: string | null;
}) => {
  const [page, setPage] = useState(0);

  const signaturesPerPage = 3;
  const displayedSignatures = signatures.slice(
    page * signaturesPerPage,
    page * signaturesPerPage + signaturesPerPage,
  );

  const backStyle = page !== 0 ? "bg-ghost" : "invisible";
  const nextStyle =
    page < Math.ceil(signatures.length / signaturesPerPage) - 1
      ? "bg-ghost"
      : "invisible";

  if (displayedSignatures.length === 0) {
    return (
      <article className="prose prose-dark mb-4">
        <p className="text-center text-slate-300">
          No wishes could be found 😭
          <br />
          Be the first to sign this card!
        </p>
      </article>
    );
  }

  const sharedBtnStyle = "h-10 w-12 rounded-lg p-2 lg:w-fit text-white";
  const totalPages = Math.ceil(signatures.length / signaturesPerPage);

  const Signature = (props: { signature: CardWish; admin?: boolean }) => {
    const SignatureText = () => {
      const isWishCreator = props.signature.creatorId == currentUser;
      const isCardCreator = card.creatorId == currentUser;

      const Delete = () => {
        if (!isCardCreator && !isWishCreator) return <></>;

        const clientAction = async () => {
          await deleteWish(props.signature.id);
          toast("Wish deleted");
          location.href = `/c/${card.id}`;
        };

        return (
          <form action={clientAction} className="inline-block">
            <Button variant={"ghost"} size="sm" type="submit">
              <TrashIcon />
            </Button>
          </form>
        );
      };

      if (isWishCreator || isCardCreator) {
        return (
          <Popover>
            <PopoverTrigger>
              <p className="text-start">{props.signature.text}</p>
            </PopoverTrigger>
            <PopoverContent
              className="w-fit space-x-4 bg-black/60"
              side="right"
            >
              {isWishCreator && (
                <EditWishDialog signature={props.signature}>
                  <Button variant={"ghost"} size="sm">
                    <PencilIcon />
                  </Button>
                </EditWishDialog>
              )}

              <Delete />
            </PopoverContent>
          </Popover>
        );
      }
      return <p className="text-start">{props.signature.text}</p>;
    };

    return (
      <div className="mb-4 flex flex-row" key={props.signature.id}>
        <img
          src={props.signature.profilePicture}
          className="mt-[0.375rem] h-10 w-10 rounded-full"
        />
        <div className="ml-2 flex w-[75%] flex-col text-[1rem] lg:w-[78%]">
          <b>{props.signature.username}</b>
          <SignatureText />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <h1 className="ml-2 mt-2 space-y-1">
        {displayedSignatures.map((signature: CardWish) => (
          <Signature signature={signature} key={signature.id} />
        ))}
      </h1>
      <div className="mx-2 mb-2 flex flex-row items-center justify-between">
        <button
          className={`mt-2 ${sharedBtnStyle} ${backStyle}`}
          onClick={() => setPage(Math.max(0, page - 1))}
        >
          <ArrowLeftIcon />
        </button>
        <p>
          {page + 1} / {totalPages}
        </p>
        <button
          className={`${sharedBtnStyle} ${nextStyle}`}
          onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default Signatures;
