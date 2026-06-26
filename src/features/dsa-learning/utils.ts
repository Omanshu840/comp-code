import type { DsaProblem } from "./content"

export function getProblemStatus(problem: DsaProblem, completed: Set<string>, activeId: string) {
  if (completed.has(problem.problem_id)) {
    return "completed"
  }

  if (problem.problem_id === activeId) {
    return "active"
  }

  return "pending"
}

export function getActiveProblemId(track: DsaProblem[], completed: Set<string>) {
  // Find the index of the last completed problem in the track order.
  const lastCompletedIndex = track.reduce((lastIndex, problem, currentIndex) => {
    return completed.has(problem.problem_id) ? currentIndex : lastIndex
  }, -1)

  // If no problems are completed, the first problem is active.
  if (lastCompletedIndex === -1) {
    return track[0]?.problem_id ?? ""
  }

  // Find the next uncompleted problem after the last completed one.
  for (let i = lastCompletedIndex + 1; i < track.length; i++) {
    if (!completed.has(track[i].problem_id)) {
      return track[i].problem_id
    }
  }

  // If all problems after the last completed one are also completed,
  // loop back and find the first uncompleted problem from the start of the track.
  const firstUncompleted = track.find((p) => !completed.has(p.problem_id))
  if (firstUncompleted) {
    return firstUncompleted.problem_id
  }

  // If all problems are completed, make the last problem active.
  return track[track.length - 1]?.problem_id ?? ""
}

export function difficultyVariant(difficulty: string) {
  if (difficulty.toLowerCase() === "hard") {
    return "danger" as const
  }

  if (difficulty.toLowerCase() === "medium") {
    return "warning" as const
  }

  return "success" as const
}

export function isValidExternalLink(value: string | undefined) {
  return Boolean(value && !value.startsWith("$"))
}
