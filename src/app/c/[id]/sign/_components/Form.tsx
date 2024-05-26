"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import React from "react";
import { toast } from "sonner";
import { createWish } from "~/server/actions/createWish";

export default function Form(props: { cardId: string }) {
  const clientFunction = async (formData: FormData) => {
    await createWish(formData, props.cardId);
    toast("Card has been signed.");
    setTimeout(() => {
      location.href = `/c/${props.cardId}`;
    }, 1500);
  };

  return (
    <form className="my-12" action={clientFunction}>
      <section className="space-y-2">
        <Input placeholder="Your wish" className="py-2" name="wish" />
      </section>
      <div className="float-right space-x-4">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
