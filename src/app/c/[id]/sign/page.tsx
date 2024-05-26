import Modal from "~/app/@modal/(.)[id]/sign/modal";

export default function SignPage({
  params: { id: cardId },
}: {
  params: { id: string };
}) {
  return (
    <div>
      <section className="relative">
        <div className="flex flex-col items-center justify-center md:flex-row">
          <Modal id={cardId} />
        </div>
      </section>
    </div>
  );
}
