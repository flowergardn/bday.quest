import { useState } from "react";
import CardWish from "~/interfaces/CardWish";

const Signatures = ({ signatures }: { signatures: CardWish[] }) => {
  const [page, setPage] = useState(0);

  const signaturesPerPage = 4;
  const displayedSignatures = signatures.slice(
    page * signaturesPerPage,
    page * signaturesPerPage + signaturesPerPage,
  );

  const backStyle = page !== 0 ? "bg-pink-300" : "invisible";
  const nextStyle =
    page < Math.ceil(signatures.length / signaturesPerPage) - 1
      ? "bg-pink-300"
      : "invisible";

  if (displayedSignatures.length === 0) {
    return (
      <article className="prose mb-4">
        <p>No wishes could be found 😭</p>
      </article>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <h1 className="ml-2 mt-2 space-y-1">
        {displayedSignatures.map((signature: CardWish) => (
          <Signature signature={signature} />
        ))}
      </h1>
      <div className="mx-2 mb-2 flex flex-row items-center justify-between">
        <button
          className={`mt-2 h-10 w-12 rounded-lg p-2 lg:w-fit ${backStyle}`}
          onClick={() => setPage(Math.max(0, page - 1))}
        >
          ◄
        </button>
        <p>
          {page + 1} / {Math.ceil(signatures.length / signaturesPerPage)}
        </p>
        <button
          className={`h-10 w-12 rounded-lg p-2 lg:w-fit ${nextStyle}`}
          onClick={() =>
            setPage(
              Math.min(
                page + 1,
                Math.ceil(signatures.length / signaturesPerPage) - 1,
              ),
            )
          }
        >
          ►
        </button>
      </div>
    </div>
  );
};

const Signature = (props: { signature: CardWish }) => {
  return (
    <div className="flex flex-row" key={props.signature.id}>
      <img
        src={props.signature.profilePicture}
        className="mt-[0.375rem] h-10 w-10 rounded-full"
      />
      <div className="ml-2 flex w-[75%] flex-col text-[1rem] lg:w-[78%]">
        <b>{props.signature.username}</b>
        <button
          className={`max-h-6 w-full truncate text-ellipsis text-start`}
          onClick={() => {
            alert(props.signature.text);
          }}
        >
          {props.signature.text}
        </button>
      </div>
    </div>
  );
};

export default Signatures;
