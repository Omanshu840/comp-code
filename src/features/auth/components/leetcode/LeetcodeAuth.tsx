import { LogIn } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useLeetcodeAuthStore } from "@/store/leetcode-auth-store"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LeetcodeLoginForm } from "./LeetcodeLoginForm"

export function LeetcodeAuth() {
  const { isAuthenticated, user, logout } = useLeetcodeAuthStore()
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-semibold">
            {user && typeof user === "object" && "username" in user && typeof user.username === "string" ? user.username : "User"}
          </div>
          <div className="text-xs text-muted-foreground">LeetCode User</div>
        </div>
        <Button onClick={logout} variant="outline" size="sm">
          Logout
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button onClick={() => setIsLoginOpen(true)} variant="outline">
        <LogIn className="mr-2 size-4" />
        Login
      </Button>
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
