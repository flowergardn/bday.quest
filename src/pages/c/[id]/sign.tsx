import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type FormValues = {
  message: string;
};

const CardPage: NextPage<{ id: string }> = ({ id }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>();

  const {
    data,
    isLoading: cardLoading,
    isError: cardError,
  } = api.cards.fetch.useQuery(
    {
      cardId: id,
    },
    {
      staleTime: Infinity,
    },
  );

  const { mutate, isError, error } = api.cards.createWish.useMutation({
    onSuccess: () => {
      location.href = `/c/${id}`;
    },
  });

  if (cardLoading) return <></>;
  if (cardError || !data) return <></>;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate({
      cardId: id,
      message: data.message,
    });
  };

  const Error = (props: { error: string }) => {
    return (
      <div>
        <div
          className={`animate-fadeIn alert alert-error mt-10 pl-10 pr-10 shadow-lg`}
        >
          <div>
            <span>{props.error}</span>
          </div>
        </div>
      </div>
    );
  };

  const CardInfo = () => {
    return (
      <article className="prose">
        <h1>{data.title}</h1>
        <p>{data.description}</p>
      </article>
    );
  };

  const CreateWish = () => {
    return (
      <>
        <article className="prose mb-6">
          <h2>Send your wish</h2>
        </article>
        <div className="mx-2 h-full">
          <form
            className="flex h-full flex-col justify-between"
            onSubmit={handleSubmit(onSubmit)}
          >
            <textarea
              placeholder="Your message"
              className="textarea textarea-bordered textarea-md mb-2 h-full w-full resize-none rounded-lg border-none bg-accent shadow-lg"
              {...register("message", {
                required: true,
                maxLength: 300,
              })}
            />
            <button className="btn btn-accent mt-4">Send</button>
          </form>
        </div>

        {errors.message && (
          <Error error={"You must not exceed the 300 character limit"} />
        )}
        {isError && <Error error={error?.message?.toString() ?? ""} />}
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
          <CreateWish />
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
