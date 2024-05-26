"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import React from "react";
import { createCard } from "~/server/actions/createCard";
import { toast } from "sonner";

export default function Form() {
  const clientFunction = async (formData: FormData) => {
    const cardResponse = await createCard(formData);
    toast("Card has been created.");
    setTimeout(() => {
      location.href = `/c/${cardResponse.id}`;
    }, 1500);
  };

  return (
    <form className="my-12" action={clientFunction}>
      <section className="space-y-2">
        <Input placeholder="Title" className="py-2" name="title" />
        <Input placeholder="Description" className="py-2" name="description" />
      </section>
      <div className="float-right space-x-4">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
