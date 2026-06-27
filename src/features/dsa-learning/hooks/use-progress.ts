import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  type DsaProgress,
  type DsaStreak,
  addDsaProgress,
  getDsaProgress,
  getDsaStreak,
} from "../api/progress"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { supabase } from "@/lib/supabase-client"

const DSA_PROGRESS_QUERY_KEY = "dsa-progress"
const DSA_STREAK_QUERY_KEY = "dsa-streak"

// How long fetched data is considered fresh — prevents redundant refetches
// when navigating between Dashboard and LessonPage within this window.
const STALE_TIME_MS = 5 * 60 * 1000 // 5 minutes

// ─── Shared helper ──────────────────────────────────────────────────────────

/**
 * Returns true if `isoTimestamp` is from a different calendar day than today
 * (in local time). Used to decide whether to count today as a streak day.
 */
function isFromEarlierDay(isoTimestamp: string): boolean {
  const last = new Date(isoTimestamp)
  const now = new Date()
  return (
    last.getFullYear() !== now.getFullYear() ||
    last.getMonth() !== now.getMonth() ||
    last.getDate() !== now.getDate()
  )
}

/**
 * Returns the number of whole calendar days between two dates (local time).
 * e.g. yesterday → today = 1, two days ago → today = 2.
 */
function calendarDayDiff(isoTimestamp: string): number {
  const last = new Date(isoTimestamp)
  const now = new Date()
  const lastMidnight = new Date(last.getFullYear(), last.getMonth(), last.getDate())
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((nowMidnight.getTime() - lastMidnight.getTime()) / (1000 * 60 * 60 * 24))
}

// ─── Progress ────────────────────────────────────────────────────────────────

export function useDsaProgress() {
  const { session } = useAuth()
  const userId = session?.user?.id
  const queryClient = useQueryClient()

  const { data: progress, isLoading } = useQuery<DsaProgress[] | null>({
    queryKey: [DSA_PROGRESS_QUERY_KEY, userId],
    queryFn: () => (userId ? getDsaProgress(userId) : null),
    enabled: !!userId,
    staleTime: STALE_TIME_MS,
  })

  const { mutate: addProgress, isPending: isAddingProgress } = useMutation({
    mutationFn: (problemId: string) => {
      if (!userId) throw new Error("User not logged in")
      return addDsaProgress(userId, problemId)
    },
    onSuccess: () => {
      // Only invalidate progress here; streak is handled by updateStreak's own onSuccess.
      queryClient.invalidateQueries({ queryKey: [DSA_PROGRESS_QUERY_KEY, userId] })
    },
  })

  return { progress, isLoading, addProgress, isAddingProgress }
}

// ─── Streak ──────────────────────────────────────────────────────────────────

export function useDsaStreak() {
  const { session } = useAuth()
  const userId = session?.user?.id
  const queryClient = useQueryClient()

  const { data: streak, isLoading } = useQuery<DsaStreak | null>({
    queryKey: [DSA_STREAK_QUERY_KEY, userId],
    queryFn: () => (userId ? getDsaStreak(userId) : null),
    enabled: !!userId,
    staleTime: STALE_TIME_MS,
  })

  const { mutate: updateStreak, isPending: isUpdatingStreak } = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not logged in")

      // Read from the TanStack cache instead of issuing a fresh network request.
      const cached = queryClient.getQueryData<DsaStreak | null>([
        DSA_STREAK_QUERY_KEY,
        userId,
      ])

      if (cached) {
        // Already completed today — no write needed.
        if (!isFromEarlierDay(cached.last_completed_at)) {
          return cached
        }

        const diffDays = calendarDayDiff(cached.last_completed_at)

        if (diffDays === 1) {
          // Consecutive day — increment streak.
          const { data, error } = await supabase
            .from("dsa_streaks")
            .update({
              streak: cached.streak + 1,
              last_completed_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .select()
            .single()

          if (error) {
            console.error("Error updating DSA streak:", error)
            return null
          }
          return data
        } else {
          // Missed one or more days — reset to 1.
          const { data, error } = await supabase
            .from("dsa_streaks")
            .update({ streak: 1, last_completed_at: new Date().toISOString() })
            .eq("user_id", userId)
            .select()
            .single()

          if (error) {
            console.error("Error resetting DSA streak:", error)
            return null
          }
          return data
        }
      } else {
        // No cached streak — fetch once to decide what to do.
        const fresh = await getDsaStreak(userId)

        if (fresh) {
          // Streak row exists in DB but wasn't cached; run the same logic.
          if (!isFromEarlierDay(fresh.last_completed_at)) {
            return fresh
          }

          const diffDays = calendarDayDiff(fresh.last_completed_at)
          const newStreak = diffDays === 1 ? fresh.streak + 1 : 1

          const { data, error } = await supabase
            .from("dsa_streaks")
            .update({ streak: newStreak, last_completed_at: new Date().toISOString() })
            .eq("user_id", userId)
            .select()
            .single()

          if (error) {
            console.error("Error updating DSA streak:", error)
            return null
          }
          return data
        } else {
          // Brand-new user — create streak row.
          const { data, error } = await supabase
            .from("dsa_streaks")
            .insert([
              {
                user_id: userId,
                streak: 1,
                last_completed_at: new Date().toISOString(),
              },
            ])
            .select()
            .single()

          if (error) {
            console.error("Error creating DSA streak:", error)
            return null
          }
          return data
        }
      }
    },
    onSuccess: (data) => {
      if (data) {
        // Write the fresh value directly into the cache so no refetch is needed.
        queryClient.setQueryData([DSA_STREAK_QUERY_KEY, userId], data)
      }
    },
  })

  return { streak, isLoading, updateStreak, isUpdatingStreak }
}

// ─── Lesson-only hook (mutations only, no queries) ───────────────────────────

/**
 * Use this on LessonPage instead of the full hooks above.
 * It exposes only the mutation functions — no useQuery calls, so no extra
 * network requests are fired when the lesson mounts.
 */
export function useLessonCompletion() {
  const { session } = useAuth()
  const userId = session?.user?.id
  const queryClient = useQueryClient()

  const { mutate: addProgress, isPending: isAddingProgress } = useMutation({
    mutationFn: (problemId: string) => {
      if (!userId) throw new Error("User not logged in")
      return addDsaProgress(userId, problemId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DSA_PROGRESS_QUERY_KEY, userId] })
    },
  })

  const { mutate: updateStreak, isPending: isUpdatingStreak } = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not logged in")

      const cached = queryClient.getQueryData<DsaStreak | null>([
        DSA_STREAK_QUERY_KEY,
        userId,
      ])

      if (cached) {
        if (!isFromEarlierDay(cached.last_completed_at)) {
          return cached
        }

        const diffDays = calendarDayDiff(cached.last_completed_at)

        if (diffDays === 1) {
          const { data, error } = await supabase
            .from("dsa_streaks")
            .update({
              streak: cached.streak + 1,
              last_completed_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .select()
            .single()

          if (error) {
            console.error("Error updating DSA streak:", error)
            return null
          }
          return data
        } else {
          const { data, error } = await supabase
            .from("dsa_streaks")
            .update({ streak: 1, last_completed_at: new Date().toISOString() })
            .eq("user_id", userId)
            .select()
            .single()

          if (error) {
            console.error("Error resetting DSA streak:", error)
            return null
          }
          return data
        }
      } else {
        // Cache miss (e.g. user navigated directly to lesson URL) — fetch once.
        const fresh = await getDsaStreak(userId)

        if (fresh) {
          if (!isFromEarlierDay(fresh.last_completed_at)) {
            return fresh
          }

          const diffDays = calendarDayDiff(fresh.last_completed_at)
          const newStreak = diffDays === 1 ? fresh.streak + 1 : 1

          const { data, error } = await supabase
            .from("dsa_streaks")
            .update({ streak: newStreak, last_completed_at: new Date().toISOString() })
            .eq("user_id", userId)
            .select()
            .single()

          if (error) {
            console.error("Error updating DSA streak:", error)
            return null
          }
          return data
        } else {
          const { data, error } = await supabase
            .from("dsa_streaks")
            .insert([
              {
                user_id: userId,
                streak: 1,
                last_completed_at: new Date().toISOString(),
              },
            ])
            .select()
            .single()

          if (error) {
            console.error("Error creating DSA streak:", error)
            return null
          }
          return data
        }
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData([DSA_STREAK_QUERY_KEY, userId], data)
      }
    },
  })

  return { addProgress, isAddingProgress, updateStreak, isUpdatingStreak }
}