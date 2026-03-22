import { useAuthStore } from "@/store/auth-store"

export function useAuthGuard() {
  const { csrf, isAuthenticated, session, user } = useAuthStore()

  return {
    isAuthenticated,
    requiresAuth: !isAuthenticated,
    session,
    csrf,
    user,
  }
}
