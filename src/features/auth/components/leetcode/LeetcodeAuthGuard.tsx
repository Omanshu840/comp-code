import { useState } from "react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useLeetcodeAuthGuard } from "../../hooks/useLeetcodeAuthGuard"
import { LeetcodeLoginPage } from "./LeetcodeLoginPage"
import { LeetcodeLoginForm } from "./LeetcodeLoginForm"

type AuthGuardProps = {
  children: ReactNode
  fallback?: ReactNode
  mode?: "redirect" | "modal"
}

export function LeetcodeAuthGuard({
  children,
  fallback,
  mode = "redirect",
}: AuthGuardProps) {
  const { isAuthenticated } = useLeetcodeAuthGuard()
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  if (isAuthenticated) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (mode === "redirect") {
    return <LeetcodeLoginPage />
  }

  return (
    <>
      <div className="p-4">
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              This feature requires a valid LeetCode session before it can be
              used.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Connect your `LEETCODE_SESSION` and `csrftoken` to continue.
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsLoginOpen(true)}>Open login</Button>
          </CardFooter>
        </Card>
      </div>

      {isLoginOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-border/80 bg-card/95 shadow-lg">
            <CardHeader>
              <CardTitle>Log In With Session Cookies</CardTitle>
              <CardDescription>
                Validate your LeetCode session to access this protected feature.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeetcodeLoginForm
                onSuccess={() => {
                  setIsLoginOpen(false)
                }}
              />
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsLoginOpen(false)
                }}
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </>
  )
}
