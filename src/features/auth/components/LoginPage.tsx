import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthStore } from "@/store/auth-store"

import { LoginForm } from "./LoginForm"

export function LoginPage() {
  const { isAuthenticated, logout, user } = useAuthStore()

  function handleLogout() {
    logout()
  }

  if (isAuthenticated) {
    return (
      <main className="relative min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.08),_transparent_40%),linear-gradient(180deg,_var(--color-background),_color-mix(in_oklab,var(--color-muted)_60%,white))] px-6 py-10">
        <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-5xl items-center justify-center">
          <Card className="w-full max-w-xl border-border/80 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Session Connected</CardTitle>
              <CardDescription>
                Your LeetCode session has been validated and stored locally.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                <p className="text-muted-foreground">Signed in as</p>
                <p className="mt-1 text-base font-semibold">
                  {typeof user?.username === "string" ? user.username : "User"}
                </p>
              </div>
              <div className="grid gap-3 rounded-xl border border-border/70 bg-background/80 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Session token</p>
                  <p className="mt-1 font-mono text-xs">Stored in localStorage</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CSRF token</p>
                  <p className="mt-1 font-mono text-xs">Attached to requests</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.08),_transparent_38%),linear-gradient(160deg,_color-mix(in_oklab,var(--color-muted)_50%,white),_var(--color-background)_55%)] px-6 py-10 dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_32%),linear-gradient(160deg,_color-mix(in_oklab,var(--color-card)_80%,black),_var(--color-background)_60%)]">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="inline-flex rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium tracking-[0.24em] uppercase text-muted-foreground backdrop-blur">
            CompCode Access
          </div>
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Connect your LeetCode session to unlock real submissions.
            </h1>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              Paste your `LEETCODE_SESSION` and `csrftoken`, and we&apos;ll
              validate them against LeetCode before enabling the app.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-background/70 p-4 backdrop-blur">
              Real GraphQL validation
            </div>
            <div className="rounded-xl border border-border/70 bg-background/70 p-4 backdrop-blur">
              Tokens persisted locally
            </div>
            <div className="rounded-xl border border-border/70 bg-background/70 p-4 backdrop-blur">
              Auth headers injected automatically
            </div>
          </div>
        </section>

        <Card className="border-border/80 bg-card/95 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle>Log In With Session Cookies</CardTitle>
            <CardDescription>
              We only store the values in your browser so future requests can
              attach the required LeetCode headers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="border-t border-border/70 pt-6 text-xs leading-5 text-muted-foreground">
            Your cookies are required because LeetCode does not expose an
            official login API for this workflow.
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
