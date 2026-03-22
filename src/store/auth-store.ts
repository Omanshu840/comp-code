import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
  clearLeetCodeAuthTokens,
  setLeetCodeAuthTokens,
} from "../lib/api-client"

type AuthUser = Record<string, unknown> | null

type AuthState = {
  isAuthenticated: boolean
  session: string | null
  csrf: string | null
  user: AuthUser
  login: (session: string, csrf: string) => void
  setUser: (user: AuthUser) => void
  logout: () => void
}

const AUTH_STORAGE_KEY = "auth-storage"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      session: null,
      csrf: null,
      user: null,
      login: (session, csrf) => {
        setLeetCodeAuthTokens(session, csrf)
        set({
          isAuthenticated: true,
          session,
          csrf,
        })
      },
      setUser: (user) => {
        set({ user })
      },
      logout: () => {
        clearLeetCodeAuthTokens()
        set({
          isAuthenticated: false,
          session: null,
          csrf: null,
          user: null,
        })
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (!state?.session || !state.csrf) {
          clearLeetCodeAuthTokens()
          return
        }

        setLeetCodeAuthTokens(state.session, state.csrf)
      },
    },
  ),
)
