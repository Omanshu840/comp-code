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

// ─── Shared helpers ──────────────────────────────────────────────────────────

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000 // UTC+5:30

/**
 * Converts a Date object to its equivalent in IST by adding the offset,
 * then returns a new Date object representing the start of that day in UTC.
 * This effectively gives us a "day" value that we can compare.
 */
function getStartOfDayInIst(date: Date): Date {
  const istDate = new Date(date.getTime() + IST_OFFSET_MS)
  return new Date(
    Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate()),
  )
}

/**
 * Returns true if `isoTimestamp` is from a different calendar day than today
 * (in IST). Used to decide whether to count today as a streak day.
 */
function isFromEarlierDay(isoTimestamp: string): boolean {
  const lastStartOfDay = getStartOfDayInIst(new Date(isoTimestamp))
  const nowStartOfDay = getStartOfDayInIst(new Date())
  return lastStartOfDay.getTime() < nowStartOfDay.getTime()
}

/**
 * Returns the number of whole calendar days between two dates (in IST).
 * e.g. yesterday → today = 1, two days ago → today = 2.
 */
function calendarDayDiff(isoTimestamp: string): number {
  const lastStartOfDay = getStartOfDayInIst(new Date(isoTimestamp))
  const nowStartOfDay = getStartOfDayInIst(new Date())
  const diffMs = nowStartOfDay.getTime() - lastStartOfDay.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Core streak upsert logic. Accepts the current cached/fetched streak row
 * (or null for brand-new users) and writes the correct new value to Supabase.
 * Returns the updated row, the unchanged row (already completed today), or null
 * on error.
 */
async function upsertStreak(
  userId: string,
  current: DsaStreak | null,
): Promise<{ streakData: DsaStreak; updated: boolean } | null> {
  // Already completed today — no write needed.
  if (current && !isFromEarlierDay(current.last_completed_at)) {
    return { streakData: current, updated: false }
  }

  let newStreak = 1
  if (current) {
    const diffDays = calendarDayDiff(current.last_completed_at)
    newStreak = diffDays === 1 ? current.streak + 1 : 1
  }
  // else: brand-new user → streak stays 1

  const { data, error } = await supabase
    .from("dsa_streaks")
    .upsert(
      {
        user_id: userId,
        streak: newStreak,
        last_completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .single()

  if (error) {
    console.error("Error upserting DSA streak:", error)
    return null
  }

  return { streakData: data, updated: true }
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

      // Prefer cache, fall back to a fresh fetch.
      const current =
        queryClient.getQueryData<DsaStreak | null>([DSA_STREAK_QUERY_KEY, userId]) ??
        (await getDsaStreak(userId))

      return upsertStreak(userId, current)
    },
    onSuccess: (data) => {
      if (data?.updated) {
        // Write the fresh value directly into the cache so no refetch is needed.
        queryClient.setQueryData([DSA_STREAK_QUERY_KEY, userId], data.streakData)
        // refetch friends to update their streaks in the UI if needed
        queryClient.invalidateQueries({ queryKey: ['friends', userId] });
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

      // Prefer cache, fall back to a fresh fetch (e.g. user navigated directly
      // to the lesson URL and the Dashboard query never ran).
      const current =
        queryClient.getQueryData<DsaStreak | null>([DSA_STREAK_QUERY_KEY, userId]) ??
        (await getDsaStreak(userId))

      return upsertStreak(userId, current)
    },
    onSuccess: (data) => {
      if (data?.updated) {
        queryClient.setQueryData([DSA_STREAK_QUERY_KEY, userId], data.streakData)
        // refetch friends to update their streaks in the UI if needed
        queryClient.invalidateQueries({ queryKey: ['friends', userId] });
      }
    },
  })

  return { addProgress, isAddingProgress, updateStreak, isUpdatingStreak }
}