"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import React from "react";
import { createCard } from "~/server/actions/createCard";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

export default function Form() {
  const clientFunction = async (formData: FormData) => {
    const cardResponse = await createCard(formData);
    if (!cardResponse.success) {
      toast(cardResponse.error);
      return;
    }

    setTimeout(() => {
      location.href = `/c/${cardResponse.data.id}`;
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

  const router = useRouter();

  return (
    <form className="my-12" action={clientFunction}>
      <section className="space-y-2">
        <Input placeholder="Title" className="py-2" name="title" />
        <Input placeholder="Description" className="py-2" name="description" />
        <Input placeholder="Birthday" className="py-2" name="birthday" />
      </section>
      <div className="float-right mt-4">
        <Button
          variant="outline"
          className="mr-2"
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
