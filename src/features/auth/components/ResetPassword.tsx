import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PageState = "verifying" | "ready" | "success" | "invalid-link"

export default function ResetPassword() {
  const { supabase } = useAuth()

  const [pageState, setPageState] = useState<PageState>("verifying")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // With HashRouter, the component may mount after Supabase has already
    // exchanged the token. Check the existing session first — if it was
    // established via a recovery link, the session object carries that type.
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setPageState("ready")
        return true
      }
      return false
    }

    // Also listen for the event in case we mount before the exchange completes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setPageState("ready")
      }
    })

    // Run the session check, then fall back to invalid-link if nothing arrives.
    checkExistingSession().then((hasSession) => {
      if (!hasSession) {
        // Give onAuthStateChange enough time to fire before giving up.
        const timeout = setTimeout(() => {
          setPageState((current) => current === "verifying" ? "invalid-link" : current)
        }, 3000)

        // Store timeout id for cleanup — need a ref-like approach inside the closure.
        ;(subscription as any)._timeout = timeout
      }
    })

    return () => {
      subscription.unsubscribe()
      clearTimeout((subscription as any)._timeout)
    }
  }, [supabase])

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setPageState("success")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col px-6">
        {/* Header */}
        <div className="pt-16">
          <div className="flex justify-center">
            <img
              src="/comp-code/compcode-mark.png"
              alt="CompCode Logo"
              className="h-32 w-32 rounded-2xl border border-primary"
            />
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight">CompCode</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Learn coding one challenge at a time.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col justify-center py-12">

          {/* ── Verifying link ── */}
          {pageState === "verifying" && (
            <div className="space-y-4 text-center">
              <div className="text-4xl animate-pulse">🔐</div>
              <p className="text-sm text-muted-foreground">Verifying your reset link…</p>
            </div>
          )}

          {/* ── Invalid / expired link ── */}
          {pageState === "invalid-link" && (
            <div className="space-y-6 text-center">
              <div className="text-4xl">⚠️</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Link expired</h2>
                <p className="text-sm text-muted-foreground">
                  This reset link is invalid or has already been used. Request a new one from the login page.
                </p>
              </div>
              <Button
                className="h-14 w-full rounded-2xl text-base font-semibold"
                onClick={() => window.location.href = "/login"}
              >
                Back to Sign In
              </Button>
            </div>
          )}

          {/* ── Success ── */}
          {pageState === "success" && (
            <div className="space-y-6 text-center">
              <div className="text-4xl">✅</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Password updated</h2>
                <p className="text-sm text-muted-foreground">
                  Your password has been changed. You can now sign in with your new password.
                </p>
              </div>
              <Button
                className="h-14 w-full rounded-2xl text-base font-semibold"
                onClick={() => window.location.href = "/login"}
              >
                Go to Sign In
              </Button>
            </div>
          )}

          {/* ── Reset form ── */}
          {pageState === "ready" && (
            <>
              <div className="mb-10 space-y-2">
                <h2 className="text-2xl font-bold">Set a new password 🔑</h2>
                <p className="text-sm text-muted-foreground">
                  Choose a strong password for your account.
                </p>
              </div>

              {error && (
                <Alert className="mb-6 rounded-2xl border-destructive text-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleResetPassword} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-2xl border-border text-base"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-14 rounded-2xl border-border text-base"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl text-base font-semibold"
                >
                  {loading ? "Updating…" : "Update Password"}
                </Button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
