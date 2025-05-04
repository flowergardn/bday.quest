"use client";

import { Button } from "~/components/ui/button";
import React from "react";
import { toast } from "sonner";
import { createWish } from "~/server/actions/createWish";
import { useFormStatus } from "react-dom";
import { Textarea } from "~/components/ui/textarea";
import Link from "next/link";

export default function Form(props: { cardId: string }) {
  const clientFunction = async (formData: FormData) => {
    const createResponse = await createWish(formData, props.cardId);
    if (!createResponse.success) {
      toast(createResponse.error);
      return;
    }

    toast("Card has been signed.");
    setTimeout(() => {
      location.href = `/c/${props.cardId}`;
    }, 1500);
  };

  const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending}>
        Submit
      </Button>
    );
  };

  return (
    <form className="my-12" action={clientFunction}>
      <section className="space-y-2">
        <Textarea
          placeholder="Enter your message here..."
          className="py-2"
          name="wish"
        />
      </section>
      <div className="float-right mt-4 flex gap-4">
        <Link href={`/c/${props.cardId}`}>
          <Button variant="secondary">Cancel</Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
