import Head from "next/head";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import dayjs from "dayjs";

export default function CreateCard() {
  type CardDataValues = {
    title: string;
    description: string;
    birthday: string;
    showAge: boolean;
  };

  const { register, handleSubmit } = useForm<CardDataValues>();

  const { mutate } = api.cards.create.useMutation({
    onSuccess: (data) => (location.href = `/c/${data.id}`),
  });

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

      <div className="hero min-h-screen bg-base-200">
        <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
          <form
            className="card-body"
            onSubmit={handleSubmit((data) => {
              console.log(dayjs(data.birthday).toISOString());
              data.birthday = dayjs(data.birthday).toISOString();
              mutate(data);
            })}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                placeholder="title"
                className="input input-bordered rounded-lg"
                required
                {...register("title")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                placeholder="description"
                className="input input-bordered rounded-lg"
                required
                {...register("description")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Birthday{" "}
                  <span className="text-xs">
                    (birth year is irrelevant but nice)
                  </span>
                </span>
              </label>
              <input
                type="date"
                placeholder="description"
                className="input input-bordered rounded-lg"
                required
                {...register("birthday")}
              />
            </div>
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
