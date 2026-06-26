import { useMemo } from "react"
import { useCompletedProblems } from "../hooks/useCompletedProblems"
import { getTrackPreview } from "../content"
import { getActiveProblemId } from "../utils"
import { RoadmapBrowser } from "../components/RoadmapBrowser"

export function RoadmapPage() {
  const { completed, markCompleted } = useCompletedProblems()
  const track = useMemo(() => getTrackPreview(28), [])
  const activeId = getActiveProblemId(track, completed)

  return (
    <div className="mx-auto min-h-svh w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-12">
      <RoadmapBrowser completed={completed} activeId={activeId} markCompleted={markCompleted} />
    </div>
  )
}
