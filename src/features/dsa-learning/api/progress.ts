import { supabase } from "@/lib/supabase-client"

export type DsaProgress = {
  id: string
  user_id: string
  problem_id: string
  completed_at: string
}

export async function getDsaProgress(
  userId: string,
): Promise<DsaProgress[] | null> {
  const { data, error } = await supabase
    .from("dsa_progress")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching DSA progress:", error)
    return null
  }

  return data
}

export async function addDsaProgress(
  userId: string,
  problemId: string,
): Promise<DsaProgress | null> {
  const { data, error } = await supabase
    .from("dsa_progress")
    .insert([{ user_id: userId, problem_id: problemId }])
    .select()
    .single()

  if (error) {
    console.error("Error adding DSA progress:", error)
    return null
  }

  return data
}

export type DsaStreak = {
  id: string
  user_id: string
  streak: number
  last_completed_at: string
}

export async function getDsaStreak(userId: string): Promise<DsaStreak | null> {
  const { data, error } = await supabase
    .from("dsa_streaks")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No streak found, which is not an error
      return null
    }
    console.error("Error fetching DSA streak:", error)
    return null
  }

  return data
}

