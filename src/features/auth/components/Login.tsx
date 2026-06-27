import { useState } from "react"
import { ArrowLeft } from "lucide-react"

import { useAuth } from "../hooks/useAuth"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const { supabase } = useAuth()

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const handleSendOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setOtpSent(true)
      setMessage("Verification code sent successfully.")
    }

    setLoading(false)
  }

  const handleVerifyOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Successfully logged in.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col px-6">

        {/* Header */}

        <div className="pt-16">
          {otpSent && (
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 mb-8 rounded-full"
              onClick={() => {
                setOtpSent(false)
                setOtp("")
                setMessage("")
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="flex justify-center">
            <img src="/comp-code/compcode-mark.png" alt="CompCode Logo" className="h-32 w-32 rounded-2xl border border-primary" />
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              CompCode
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Learn coding one challenge at a time.
            </p>
          </div>
        </div>

        {/* Hero */}

        <div className="flex flex-1 flex-col justify-center py-12">

          {!otpSent ? (
            <>
              <div className="mb-10 space-y-2">
                <h2 className="text-2xl font-bold">
                  Welcome 👋
                </h2>

                <p className="text-muted-foreground text-sm">
                  Continue with your email address.
                </p>
              </div>

              {message && (
                <Alert className="mb-6 rounded-2xl">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <form
                onSubmit={handleSendOtp}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    Email Address
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
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
                    ? "Sending code..."
                    : "Continue"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-10 space-y-3">
                <h2 className="text-2xl font-bold">
                  Verify Email
                </h2>

                <p className="text-muted-foreground text-sm">
                  Enter the verification code sent to
                </p>

                <p className="font-medium break-all">
                  {email}
                </p>
              </div>

              {message && (
                <Alert className="mb-6 rounded-2xl">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <form
                onSubmit={handleVerifyOtp}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="otp"
                    className="text-sm font-medium"
                  >
                    Verification Code
                  </Label>

                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value)
                    }
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={8}
                    placeholder=""
                    className="h-16 rounded-2xl text-center text-3xl tracking-[0.5em]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl text-base font-semibold"
                >
                  {loading
                    ? "Verifying..."
                    : "Verify & Continue"}
                </Button>
              </form>

              <Button
                variant="ghost"
                className="mt-8 h-12 rounded-xl"
                onClick={() => handleSendOtp({ preventDefault() {} } as React.FormEvent<HTMLFormElement>)}
                disabled={loading}
              >
                Resend Code
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}