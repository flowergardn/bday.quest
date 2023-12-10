import type { GetStaticProps, NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import BasePage from "~/components/BasePage";
import { Textbox } from "~/components/EditCard";
import type { CardDataValues } from "~/components/EditCard";
import Loader from "~/components/Loader";
import Signatures from "~/components/Signatures";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";
import { api } from "~/utils/api";

const ManageCard: NextPage<{ id: string }> = ({ id }) => {
  const {
    data,
    isLoading: cardLoading,
    isError: isCardError,
    error: cardError,
  } = api.cards.fetch.useQuery({
    cardId: id,
    // *could* be considered insecure, but this just grabs public info anyways /shrug
    // only meant as a loose check since destructive actions will have internal checks
    requireOwner: true,
  });

  const { register, handleSubmit } = useForm<CardDataValues>();
  const ctx = api.useContext();

  const { mutate } = api.cards.edit.useMutation({
    onSuccess: () => {
      void ctx.cards.fetch.invalidate({
        cardId: id,
      });
      toast.success("Successfully edited!");
    },
  });

  if (cardLoading)
    return (
      <BasePage>
        <main className="flex min-h-screen items-center justify-center bg-base-100">
          <Loader />
        </main>
      </BasePage>
    );

  if (cardError || !data) {
    toast.error(cardError?.message ?? "");
    return (
      <BasePage>
        <main className="flex min-h-screen items-center justify-center bg-base-100">
          <article className="prose">
            <h2>Error loading mangement settings</h2>
            <p>{cardError?.message ?? ""}</p>
          </article>
        </main>
      </BasePage>
    );
  }

  const onSubmit: SubmitHandler<CardDataValues> = (data) => {
    mutate({
      cardId: id,
      ...data,
    });
  };

  const CardWishes = () => {
    const {
      data,
      isLoading: wishesLoading,
      isError: wishError,
    } = api.cards.getWishes.useQuery({
      cardId: id,
    });

    const canShow = !wishesLoading && !wishError && data;
    if (wishError || !data) return <></>;

    return (
      <>
        <article className="prose">
          <h2>Wishes</h2>
        </article>
        {canShow ? <Signatures signatures={data} admin={true} /> : <Loader />}
      </>
    );
  };

  return (
    <BasePage>
      <div className="hero flex min-h-screen items-center justify-center  bg-base-200">
        <div className="flex">
          <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
            <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
              <article className="prose">
                <h3>Edit Card</h3>
              </article>
              <Textbox
                title="Title"
                type="title"
                register={register}
                placeholder={data.title}
              />
              <Textbox
                title="Description"
                type="description"
                register={register}
                placeholder={data.description}
              />
              <div className="form-control mt-6">
                <button className="btn btn-primary">Edit</button>
              </div>
            </form>
          </div>
          <div className="card mb-4 w-full max-w-sm shrink-0 p-6 shadow-2xl">
            <CardWishes />
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default ManageCard;

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
