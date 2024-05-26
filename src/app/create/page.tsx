import CreateModal from "../@modal/(.)create/page";
export default function CreatePage() {
  return (
    <div>
      <section className="relative">
        <div className="flex flex-col items-center justify-center md:flex-row">
          <CreateModal />
        </div>
      </section>
    </div>
  );
}
