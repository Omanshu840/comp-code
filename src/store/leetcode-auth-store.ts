import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
  clearLeetCodeAuthTokens,
  setLeetCodeAuthTokens,
} from "../lib/api-client"

type LeetcodeAuthUser = Record<string, unknown> | null

type LeetcodeAuthState = {
  isAuthenticated: boolean
  session: string | null
  csrf: string | null
  user: LeetcodeAuthUser
  login: (session: string, csrf: string) => void
  setUser: (user: LeetcodeAuthUser) => void
  logout: () => void
}

const LEETCODE_AUTH_STORAGE_KEY = "leetcode-auth-storage"

export const useLeetcodeAuthStore = create<LeetcodeAuthState>()(
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
      name: LEETCODE_AUTH_STORAGE_KEY,
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
