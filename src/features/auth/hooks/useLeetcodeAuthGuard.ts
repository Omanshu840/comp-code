import { useLeetcodeAuthStore } from "@/store/leetcode-auth-store"

export function useLeetcodeAuthGuard() {
  const { csrf, isAuthenticated, session, user } = useLeetcodeAuthStore()

  return {
    isAuthenticated,
    requiresAuth: !isAuthenticated,
    session,
    csrf,
    user,
  }
}
