import { Wishes } from "@prisma/client";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Navbar from "~/components/Navbar";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";
import { api } from "~/utils/api";
import CardWish from "../interfaces/CardWish";

const CardPage: NextPage<{ id: string }> = ({ id }) => {
  const {
    data,
    isLoading: cardLoading,
    isError: cardError,
  } = api.cards.fetch.useQuery({
    cardId: id,
  });

  if (cardLoading) return <></>;
  if (cardError || !data) return <></>;

  const CardInfo = () => {
    return (
      <article className="prose">
        <h1>{data.title}</h1>
        <p>{data.description}</p>
      </article>
    );
  };

  const CardWishes = () => {
    const {
      data,
      isLoading: wishesLoading,
      isError: wishError,
    } = api.cards.getWishes.useQuery({
      cardId: id,
    });

    if (wishesLoading) return <></>;
    if (wishError || !data) return <></>;

    return (
      <>
        <article className="prose">
          <h2>Wishes</h2>
        </article>
        <Signatures signatures={data} />
        <button className="btn btn-disabled btn-primary">Create</button>
      </>
    );
  };

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
                  Math.ceil(signatures!!.length / signaturesPerPage) - 1,
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

  return (
    <>
      <Head>
        <title>bday.quest</title>
        <meta name="description" content={data.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <div className="hero flex min-h-screen flex-col items-center bg-base-100">
        <div className="card mb-12 mt-20 w-full max-w-sm shrink-0 bg-white/30 p-6 shadow-2xl">
          <CardInfo />
        </div>
        <div className="card mb-4 w-full max-w-sm shrink-0 bg-white/30 p-6 shadow-2xl">
          <CardWishes />
        </div>
      </div>
    </>
  );
};

export default CardPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.cards.fetch.prefetch({ cardId: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
