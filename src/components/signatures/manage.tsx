import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import CardWish from "~/interfaces/CardWish";

export const EditWishDialog = (props: {
  signature: CardWish;
  children: JSX.Element;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit your wish</AlertDialogTitle>
          <AlertDialogDescription>soon :tm:</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
