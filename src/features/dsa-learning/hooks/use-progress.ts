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

export function useDsaProgress() {
  const { session } = useAuth()
  const userId = session?.user?.id

  const { data: progress, isLoading } = useQuery<DsaProgress[] | null>({
    queryKey: [DSA_PROGRESS_QUERY_KEY, userId],
    queryFn: () => (userId ? getDsaProgress(userId) : null),
    enabled: !!userId,
  })

  const queryClient = useQueryClient()

  const { mutate: addProgress, isPending: isAddingProgress } = useMutation({
    mutationFn: (problemId: string) => {
      if (!userId) throw new Error("User not logged in")
      return addDsaProgress(userId, problemId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DSA_PROGRESS_QUERY_KEY, userId] })
      queryClient.invalidateQueries({ queryKey: [DSA_STREAK_QUERY_KEY, userId] })
    },
  })

  return { progress, isLoading, addProgress, isAddingProgress }
}

export function useDsaStreak() {
  const { session } = useAuth()
  const userId = session?.user?.id

  const queryClient = useQueryClient()

  const { data: streak, isLoading } = useQuery<DsaStreak | null>({
    queryKey: [DSA_STREAK_QUERY_KEY, userId],
    queryFn: () => (userId ? getDsaStreak(userId) : null),
    enabled: !!userId,
  })

  const { mutate: updateStreak, isPending: isUpdatingStreak } = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not logged in")

      const streak = await getDsaStreak(userId)

      if (streak) {
        const today = new Date()
        const lastCompleted = new Date(streak.last_completed_at)
        const diffTime = Math.abs(today.getTime() - lastCompleted.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          // Increment streak
          const { data, error } = await supabase
            .from("dsa_streaks")
            .update({
              streak: streak.streak + 1,
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
        } else if (diffDays > 1) {
          // Reset streak
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
        } else {
          // Already completed today
          return streak
        }
      } else {
        // Create new streak
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DSA_STREAK_QUERY_KEY, userId] })
    },
  })

  return { streak, isLoading, updateStreak, isUpdatingStreak }
}
