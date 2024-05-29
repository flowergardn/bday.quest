"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import React from "react";
import { createCard } from "~/server/actions/createCard";
import { toast } from "sonner";
import type CardData from "~/interfaces/CardData";

export default function Form() {
  const clientFunction = async (formData: FormData) => {
    let cardResponse: CardData;

    try {
      cardResponse = await createCard(formData);
    } catch (error: unknown) {
      if (error instanceof Error) toast(error.message);
      return;
    }

    setTimeout(() => {
      location.href = `/c/${cardResponse.id}`;
    }, 1500);
  };

  return (
    <form className="my-12" action={clientFunction}>
      <section className="space-y-2">
        <Input placeholder="Title" className="py-2" name="title" />
        <Input placeholder="Description" className="py-2" name="description" />
        <Input
          placeholder="Birthday (MM/DD/YYYY)"
          className="py-2"
          name="birthday"
        />
      </section>
      <div className="float-right mt-4">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
