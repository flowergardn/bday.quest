"use client";

import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import CardWish from "~/interfaces/CardWish";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const Signatures = ({
  signatures,
  currentUser,
  admin,
}: {
  signatures: CardWish[];
  currentUser: string | null;
  admin?: boolean;
}) => {
  const [page, setPage] = useState(0);

  const signaturesPerPage = 2;
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
          Be the first to create a wish for this card!
        </p>
      </article>
    );
  }

  const sharedBtnStyle = "h-10 w-12 rounded-lg p-2 lg:w-fit text-white";
  const totalPages = Math.ceil(signatures.length / signaturesPerPage);

  const Signature = (props: { signature: CardWish; admin?: boolean }) => {
    const Delete = () => {
      if (!props.admin) return <></>;
      return (
        <button className="btn btn-primary btn-sm w-12 rounded-lg px-3">
          <TrashIcon />
        </button>
      );
    };

    const SignatureText = () => {
      if (props.signature.creatorId == currentUser) {
        return (
          <AlertDialog>
            <AlertDialogTrigger>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-start">{props.signature.text}</p>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Click to edit your wish</p>
                </TooltipContent>
              </Tooltip>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit your wish</AlertDialogTitle>
                <AlertDialogDescription>soon :tm:</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
          <div className="space-x-1">
            <Delete />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <h1 className="ml-2 mt-2 space-y-1">
        {displayedSignatures.map((signature: CardWish) => (
          <Signature signature={signature} admin={admin} key={signature.id} />
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
