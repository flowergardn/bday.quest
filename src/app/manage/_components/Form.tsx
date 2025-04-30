"use client";

import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { deleteCard } from "~/server/actions/deleteCard";

const Form = (props: { cardId: string }) => {
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

  const SubmitButton = () => {
    const { pending } = useFormStatus();
    return <Button type="submit" variant="outline" disabled={pending}>Delete</Button>;
  }

  return (
    <form action={clientAction}>
      <SubmitButton />
    </form>
  );
};

export default Form;
