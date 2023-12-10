import type { GetStaticProps, NextPage } from "next";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import Loader from "~/components/Loader";
import BasePage from "~/components/BasePage";

type FormValues = {
  message: string;
};

const CardPage: NextPage<{ id: string }> = ({ id }) => {
  const { isLoaded, user } = useUser();

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

  if (isLoaded && !user) {
    location.href = `https://accounts.bday.quest/sign-in?redirect_url=${encodeURI(
      `https://bday.quest/c/${id}`,
    )}`;
  }

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
    <BasePage>
      <div className="hero flex min-h-screen flex-col items-center bg-base-100">
        <div className="card mb-12 mt-20 w-full max-w-sm shrink-0  p-6 shadow-2xl">
          <CardInfo />
        </div>
        <div className="card mb-4 w-full max-w-sm shrink-0  p-6 shadow-2xl">
          <CreateWish />
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
