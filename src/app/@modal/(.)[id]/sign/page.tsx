import Modal from "./modal";

export default function SignModal({
  params: { id },
}: {
  params: { id: string };
}) {
  return <Modal id={id} />;
}
