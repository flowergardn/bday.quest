import type { GetStaticProps, NextPage } from "next";

import Navbar from "~/components/Navbar";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";
import { api } from "~/utils/api";
import Signatures from "~/components/Signatures";
import Link from "next/link";
import Meta from "~/components/Meta";
import Loader from "~/components/Loader";
import { PropsWithChildren } from "react";

const CardPage: NextPage<{ id: string }> = ({ id }) => {
  const {
    data,
    isLoading: cardLoading,
    isError: cardError,
  } = api.cards.fetch.useQuery({
    cardId: id,
  });

  const BasePage = (props: PropsWithChildren) => {
    return (
      <>
        <Meta
          title="Sign this card | bday.quest (beta)"
          description={data ? data.description : ""}
        />
        <Navbar />
        {props.children}
      </>
    );
  };

  if (cardLoading)
    return (
      <BasePage>
        <main className="flex min-h-screen items-center justify-center bg-base-100">
          <Loader />
        </main>
      </BasePage>
    );

  if (cardError || !data)
    return (
      <BasePage>
        <main className="flex min-h-screen items-center justify-center bg-base-100">
          <article className="prose">
            <h2>Error loading card</h2>
            <p>Try again later :(</p>
          </article>
        </main>
      </BasePage>
    );

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

    if (wishError) return <></>;
    const canShow = !wishesLoading && !wishError && data;

    return (
      <>
        <article className="prose">
          <h2>Wishes</h2>
        </article>
        {canShow ? <Signatures signatures={data} /> : <Loader />}
        <Link href={`/c/${id}/sign`}>
          <button className="btn btn-primary">Create</button>
        </Link>
      </>
    );
  };

  return (
    <BasePage>
      <div className="hero flex min-h-screen flex-col items-center bg-base-100">
        <div className="card mb-12 mt-20 w-full max-w-sm shrink-0  p-6 shadow-2xl">
          <CardInfo />
        </div>
        <div className="card mb-4 w-full max-w-sm shrink-0  p-6 shadow-2xl">
          <CardWishes />
        </div>
      </div>
    </BasePage>
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
