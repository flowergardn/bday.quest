import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";
import { api } from "~/utils/api";
import Signatures from "~/components/Signatures";
import Link from "next/link";

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
        <Link href={`/c/${id}/sign`}>
          <button className="btn btn-primary">Create</button>
        </Link>
      </>
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
        <div className="card mb-12 mt-20 w-full max-w-sm shrink-0  p-6 shadow-2xl">
          <CardInfo />
        </div>
        <div className="card mb-4 w-full max-w-sm shrink-0  p-6 shadow-2xl">
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
