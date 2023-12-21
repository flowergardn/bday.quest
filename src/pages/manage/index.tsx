import type { Cards } from "@prisma/client";
import { Cake, Calendar, Eye, Pen, Trash } from "~/components/Icons";
import Navbar from "~/components/Navbar";
import Link from "next/link";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Meta from "~/components/Meta";
import BasePage from "~/components/BasePage";
import Loader from "~/components/Loader";
dayjs.extend(relativeTime);

export default function ManageCards() {
  const {
    data,
    isLoading: cardsLoading,
    isError: cardsError,
  } = api.cards.fetchAll.useQuery();

  const Card = (props: { card: Cards }) => {
    const now = dayjs();

    const createdAt = dayjs(props.card.createdAt);
    let birthday = dayjs(props.card.birthday).year(now.year());

    // Accounts for birthdays that have already past for this year, so it finds the next birthday (which is next year)
    if (birthday.unix() < now.unix()) {
      birthday = birthday.year(now.year() + 1);
    }

    const Created = () => {
      return (
        <div className="flex items-center">
          <div className="tooltip" data-tip="Card creation date">
            <Calendar />
          </div>
          <span className="ml-2">Created {createdAt.fromNow()}</span>
        </div>
      );
    };

    const CakeDay = () => {
      return (
        <div className="flex items-center">
          <div className="tooltip" data-tip="Next birthday">
            <Cake />
          </div>
          <span className="ml-2">
            {birthday.fromNow()} ({birthday.format("MM/DD/YYYY")})
          </span>
        </div>
      );
    };

    const DeleteCard = () => {
      const ctx = api.useContext();

      const { mutate } = api.cards.delete.useMutation({
        onSuccess: () => {
          void ctx.cards.fetchAll.invalidate();
          toast.success("Successfully deleted");
        },
      });
      return (
        <button
          className="btn btn-sm"
          onClick={() => {
            mutate({
              cardId: props.card.id,
            });
          }}
        >
          <Trash />
        </button>
      );
    };

    return (
      <div className="card w-full max-w-sm shrink-0 border p-3">
        <article className="prose mb-6">
          <h2>{props.card.title}</h2>
          <p>
            <Created />
            <CakeDay />
          </p>
        </article>
        <div className="mt-6">
          <button className="btn btn-sm mr-4">
            <Link href={`/c/${props.card.id}`}>
              <Eye />
            </Link>
          </button>
          <button className="btn btn-sm mr-4">
            <Link href={`/manage/${props.card.id}`}>
              <Pen />
            </Link>
          </button>
          <DeleteCard />
        </div>
      </div>
    );
  };

  const Cards = () => {
    if (cardsLoading) return <Loader />;

    if (cardsError || !data) return <></>;

    return (
      <div className="card-container flex flex-wrap justify-center gap-4">
        {data.map((card) => (
          <Card card={card} />
        ))}
      </div>
    );
  };

  return (
    <>
      <Meta title="Manage | bday.quest (beta)" />

      <Navbar />
      <div className="hero flex min-h-[calc(100vh-64px)] flex-col items-center bg-base-100">
        <Cards />
      </div>
    </>
  );
}
