import { useState, useCallback, useEffect } from "react"

const STREAK_KEY = "compcode.dsa.streak"
const LAST_COMPLETED_DATE_KEY = "compcode.dsa.lastCompletedDate"

function getStoredStreak() {
  const storedStreak = localStorage.getItem(STREAK_KEY)
  return storedStreak ? parseInt(storedStreak, 10) : 0
}

function getStoredLastCompletedDate() {
  const storedDate = localStorage.getItem(LAST_COMPLETED_DATE_KEY)
  return storedDate ? new Date(storedDate) : null
}

export function useStreak() {
  const [streak, setStreak] = useState(getStoredStreak)
  const [lastCompletedDate, setLastCompletedDate] = useState(
    getStoredLastCompletedDate,
  )

  useEffect(() => {
    const today = new Date()
    if (lastCompletedDate) {
      const diffTime = today.getTime() - lastCompletedDate.getTime()
      const diffDays = diffTime / (1000 * 3600 * 24)

      if (diffDays > 1) {
        setStreak(0)
        localStorage.setItem(STREAK_KEY, "0")
      }
    }
  }, [lastCompletedDate])

  const updateStreak = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const newLastCompletedDate = new Date(lastCompletedDate || 0)
    newLastCompletedDate.setHours(0, 0, 0, 0)

    if (
      !lastCompletedDate ||
      today.getTime() !== newLastCompletedDate.getTime()
    ) {
      const newStreak =
        !lastCompletedDate ||
        today.getTime() - newLastCompletedDate.getTime() > 24 * 60 * 60 * 1000
          ? 1
          : streak + 1
      setStreak(newStreak)
      localStorage.setItem(STREAK_KEY, newStreak.toString())
    }

    setLastCompletedDate(today)
    localStorage.setItem(LAST_COMPLETED_DATE_KEY, today.toISOString())
  }, [lastCompletedDate, streak])

  return { streak, updateStreak }
}
