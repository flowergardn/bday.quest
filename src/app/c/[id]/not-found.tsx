import Link from "next/link"
import { SearchX } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <Card className="relative z-10 w-full max-w-md border-border/40 bg-background/95 shadow-xl backdrop-blur">
        <CardHeader className="space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SearchX className="h-8 w-8" aria-hidden="true" />
          </div>
          <CardTitle className="text-3xl font-semibold">Card not found</CardTitle>
          <CardDescription>
            We could not find the birthday card you were looking for. It may have been deleted or the link might be incorrect.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button>
            <Link href="/">Return home</Link>
          </Button>
          <Button variant="outline">
            <Link href="/create">Create a new card</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}