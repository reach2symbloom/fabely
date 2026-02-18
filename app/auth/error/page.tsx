import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md px-6 text-center">
        <h1 className="mb-4 font-serif text-3xl font-bold text-foreground">
          Authentication Error
        </h1>
        <p className="mb-8 text-muted-foreground">
          Something went wrong during sign in. Please try again.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </main>
  )
}
