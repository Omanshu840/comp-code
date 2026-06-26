import { useState } from "react"
import { useStreak } from "./useStreak"

const COMPLETION_KEY = "compcode.dsa.completed"

export function useCompletedProblems() {
  const { updateStreak } = useStreak()
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(COMPLETION_KEY) ?? "[]"))
    } catch {
      return new Set()
    }
  })

  function markCompleted(problemId: string) {
    setCompleted((current) => {
      const next = new Set(current)
      next.add(problemId)
      localStorage.setItem(COMPLETION_KEY, JSON.stringify([...next]))
      return next
    })
    updateStreak()
  }

  return { completed, markCompleted }
}
