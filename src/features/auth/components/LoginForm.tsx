import { useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  clearLeetCodeAuthTokens,
  setLeetCodeAuthTokens,
} from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

import { validateSession } from "../api/validateSession"

type LoginFormProps = {
  submitLabel?: string
  onSuccess?: () => void
}

export function LoginForm({
  submitLabel = "Validate and continue",
  onSuccess,
}: LoginFormProps) {
  const { login, logout, setUser } = useAuthStore()
  const [session, setSession] = useState("")
  const [csrf, setCsrf] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      setLeetCodeAuthTokens(session, csrf)
      const matchedUser = await validateSession()

      login(session, csrf)
      setUser(matchedUser)
      onSuccess?.()
    } catch (submitError) {
      clearLeetCodeAuthTokens()
      logout()
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to validate your LeetCode session",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="leetcode-session">LEETCODE_SESSION</Label>
        <Input
          id="leetcode-session"
          autoComplete="off"
          onChange={(event) => setSession(event.target.value)}
          placeholder="Paste your LeetCode session cookie"
          required
          value={session}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="leetcode-csrf">csrftoken</Label>
        <Input
          id="leetcode-csrf"
          autoComplete="off"
          onChange={(event) => setCsrf(event.target.value)}
          placeholder="Paste your CSRF token"
          required
          value={csrf}
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Validating session..." : submitLabel}
      </Button>
    </form>
  )
}
