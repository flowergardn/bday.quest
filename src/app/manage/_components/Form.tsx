"use client";

import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { deleteCard } from "~/server/actions/deleteCard";

const Form = async (props: { cardId: string }) => {
  const clientAction = async () => {
    toast("Deleting card...", {
      duration: Infinity,
      id: "delete-begin",
    });
    await deleteCard(props.cardId);
    toast.dismiss("delete-begin");
    toast("Deletion complete!");
    setTimeout(() => {
      location.href = `/manage`;
    }, 1500);
  };

  return (
    <form action={clientAction}>
      <Button variant="outline">Delete</Button>
    </form>
  );
};

export default Form;
