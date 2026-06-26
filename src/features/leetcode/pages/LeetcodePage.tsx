import { useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function SessionGuardBanner() {
  const [session, setSession] = useState("")
  const [csrf, setCsrf] = useState("")
  const login = useAuthStore((state) => state.login)

  const handleLogin = () => {
    login(session, csrf)
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Leetcode Session Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="session">Session Token</Label>
              <Input
                id="session"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="Enter your Leetcode session token"
              />
            </div>
            <div>
              <Label htmlFor="csrf">CSRF Token</Label>
              <Input
                id="csrf"
                value={csrf}
                onChange={(e) => setCsrf(e.target.value)}
                placeholder="Enter your Leetcode CSRF token"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              To get your tokens, open your browser's developer tools, go to the
              Network tab, and look for a request to leetcode.com. Then, in the
              request headers, find the `cookie` header and copy the values for `LEETCODE_SESSION` and `csrftoken`.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function LeetcodePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className="h-full">
      {isAuthenticated ? (
        <div>
          <h1 className="text-2xl font-bold">Leetcode Workspace</h1>
          {/* Leetcode Workspace content will go here */}
        </div>
      ) : (
        <SessionGuardBanner />
      )}
    </div>
  )
}
