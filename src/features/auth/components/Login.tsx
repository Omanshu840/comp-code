import { useState } from "react"
import { useAuth } from "../hooks/useAuth"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Mode = "login" | "signup" | "forgot-password" | "forgot-password-sent"

export default function Login() {
  const { supabase } = useAuth()

  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null)

  const switchMode = (next: Mode) => {
    setMode(next)
    setMessage(null)
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage({ text: error.message, type: "error" })
    } else {
      setMessage({ text: "Successfully signed in.", type: "success" })
    }

    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage({ text: error.message, type: "error" })
    } else {
      setMessage({ text: "Account created! Check your email to confirm.", type: "success" })
    }

    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`,
    })

    if (error) {
      setMessage({ text: error.message, type: "error" })
    } else {
      switchMode("forgot-password-sent")
    }

    setLoading(false)
  }

  const isAuthMode = mode === "login" || mode === "signup"

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

          {/* ── Forgot password sent ── */}
          {mode === "forgot-password-sent" ? (
            <div className="space-y-6 text-center">
              <div className="text-4xl">📬</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Check your inbox</h2>
                <p className="text-sm text-muted-foreground">
                  We sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                </p>
              </div>
              <Button
                variant="ghost"
                className="h-12 w-full rounded-xl"
                onClick={() => switchMode("login")}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-10 space-y-2">
                <h2 className="text-2xl font-bold">
                  {mode === "login" && "Welcome back 👋"}
                  {mode === "signup" && "Create an account 🚀"}
                  {mode === "forgot-password" && "Reset your password"}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {mode === "login" && "Sign in to your account."}
                  {mode === "signup" && "Start learning with CompCode today."}
                  {mode === "forgot-password" &&
                    "Enter your email and we'll send you a reset link."}
                </p>
              </div>

              {message && (
                <Alert
                  className={`mb-6 rounded-2xl ${
                    message.type === "error"
                      ? "border-destructive text-destructive"
                      : ""
                  }`}
                >
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              {/* ── Forgot password form ── */}
              {mode === "forgot-password" && (
                <form onSubmit={handleForgotPassword} className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 rounded-2xl border-border text-base"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-14 w-full rounded-2xl text-base font-semibold"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="h-12 w-full rounded-xl"
                    onClick={() => switchMode("login")}
                  >
                    Back to Sign In
                  </Button>
                </form>
              )}

              {/* ── Login / Signup form ── */}
              {isAuthMode && (
                <form
                  onSubmit={mode === "login" ? handleLogin : handleSignUp}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 rounded-2xl border-border text-base"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      {mode === "login" && (
                        <button
                          type="button"
                          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                          onClick={() => switchMode("forgot-password")}
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 rounded-2xl border-border text-base"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-14 w-full rounded-2xl text-base font-semibold"
                  >
                    {loading
                      ? mode === "login"
                        ? "Signing in..."
                        : "Creating account..."
                      : mode === "login"
                      ? "Sign In"
                      : "Sign Up"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="h-12 w-full rounded-xl"
                    onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                  >
                    {mode === "login"
                      ? "Don't have an account? Sign Up"
                      : "Already have an account? Sign In"}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}