import Head from "next/head";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import Navbar from "~/components/Navbar";

export default function CreateCard() {
  type CardDataValues = {
    title: string;
    description: string;
    birthday: string;
    showAge: boolean;
  };
  // used for type-checking in our textbox component
  type CardDataTypes = "title" | "description" | "birthday";

  const { register, handleSubmit } = useForm<CardDataValues>();

  const { mutate } = api.cards.create.useMutation({
    onSuccess: (data) => (location.href = `/c/${data.id}`),
  });

  const Textbox = (props: {
    title: React.ReactNode;
    type: CardDataTypes;
    inputType?: string;
  }) => {
    return (
      <div className="form-control">
        <label className="label">
          <span className="label-text">{props.title}</span>
        </label>
        <input
          type={props.inputType ? props.inputType : "text"}
          placeholder={props.type}
          className="input input-bordered rounded-lg"
          required
          {...register(props.type)}
        />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>bday.quest</title>
        <meta
          name="description"
          content="Create custom birthday cards for your friends."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <div className="hero min-h-screen bg-base-200">
        <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
          <form
            className="card-body"
            onSubmit={handleSubmit((data) => {
              data.birthday = dayjs(data.birthday).toISOString();
              mutate(data);
            })}
          >
            <Textbox title="Title" type="title" />
            <Textbox title="Description" type="description" />
            <Textbox
              title={
                <>
                  Birthday{" "}
                  <span className="text-xs">
                    (birth year is irrelevant but nice)
                  </span>
                </>
              }
              type="birthday"
              inputType="date"
            />
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Show age?</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("showAge")}
                />
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
