import Form from "~/app/create/_components/Form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export default function CreateModal() {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a card</AlertDialogTitle>
          <AlertDialogDescription>
            Tell us all the details about your birthday card.
          </AlertDialogDescription>
          <Form />
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
