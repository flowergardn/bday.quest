import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Form from "~/app/c/[id]/sign/_components/Form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export default function Modal(props: { id: string }) {
  const user = auth();

  if (!user.userId) {
    return (
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hey there!</AlertDialogTitle>
            <AlertDialogDescription>
              In order to sign this card, you need to be signed in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              <SignInButton
                forceRedirectUrl={`/c/${props.id}/sign`}
                signUpForceRedirectUrl={`/c/${props.id}/sign`}
              >
                Sign in
              </SignInButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign this card</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your message below
          </AlertDialogDescription>
          <Form cardId={props.id} />
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
