import { BookOpen, Check, Play } from "lucide-react"
import { useMemo, useRef, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

import { getTrackPreview, getSystemDesignTrackPreview } from "../content"
import type { DsaProblem } from "../content"
import { useCompletedProblems } from "../hooks/useCompletedProblems"
import { difficultyVariant, getActiveProblemId, getProblemStatus } from "../utils"

type Track = "DSA" | "System Design"

export function DashboardPage() {
  const [trackType, setTrackType] = useState<Track>("DSA")
  const { completed } = useCompletedProblems()
  const navigate = useNavigate()

  const track = useMemo(() => {
    if (trackType === "System Design") {
      return getSystemDesignTrackPreview()
    }
    return getTrackPreview()
  }, [trackType])

  const activeId = getActiveProblemId(track, completed)
  const activeProblem = track.find((problem) => problem.problem_id === activeId) ?? track[0]

  const activeProblemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (activeProblemRef.current) {
        activeProblemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }, 300)
  }, [activeId])

  const groupedProblems = useMemo(() => {
    return track.reduce(
      (acc, problem) => {
        const subcategory = problem.subcategoryName
        if (!acc[subcategory]) {
          acc[subcategory] = []
        }
        acc[subcategory].push(problem)
        return acc
      },
      {} as Record<string, DsaProblem[]>,
    )
  }, [track])

  const handleProblemClick = (problem: DsaProblem) => {
    navigate(`/learn/${problem.problem_id}/lesson`)
  }

  return (
    <div className="w-full">
      <header className="sticky top-0 z-30 flex flex-col gap-4">
        <div className="flex items-center justify-between bg-background">
          <ToggleGroup
            type="single"
            defaultValue="DSA"
            onValueChange={(value: Track) => {
              if (value) setTrackType(value)
            }}
          >
            <ToggleGroupItem value="DSA">DSA</ToggleGroupItem>
            <ToggleGroupItem value="System Design">System Design</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {activeProblem && (
          <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col bg-card p-4 rounded-lg border">
              <div className="text-xs text-muted-foreground">
                {activeProblem.categoryName} &gt; {activeProblem.subcategoryName}
              </div>
              <h1 className="text-lg font-semibold truncate">
                {activeProblem.problem_name}
              </h1>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto w-full max-w-2xl px-4 pb-28 sm:px-6 lg:px-8">

        <section className="relative mx-auto mt-8 max-w-xl pb-10" id="track">
          <div className="absolute left-1/2 top-6 h-full w-px -translate-x-1/2 bg-border" />
          <div className="space-y-8">
            {Object.entries(groupedProblems).map(
              ([subcategoryName, problems]) => (
                <div key={subcategoryName} className="relative">
                  <div className="z-10 h-0 text-center">
                    <div className="inline-block rounded-full border-2 border-primary bg-background px-4 py-2 font-semibold text-primary">
                      {subcategoryName}
                    </div>
                  </div>

                  <div className="space-y-4 pt-20">
                    {problems.map((problem) => {
                      const status = getProblemStatus(
                        problem,
                        completed,
                        activeId,
                      )
                      const enabled = problem.approaches.length > 0 || trackType === "System Design"
                      const ref =
                        problem.problem_id === activeId ? activeProblemRef : null

                      return (
                        <div
                          className="relative flex justify-center"
                          key={problem.problem_id}
                          ref={ref}
                        >
                          <Card className="z-10 flex w-full max-w-sm items-center gap-3 border-border bg-background p-3 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#3f3f46]">
                            <Button
                              aria-disabled={!enabled}
                              className={cn(
                                "grid size-14 shrink-0 place-items-center rounded-xl bg-success border border-foreground text-foreground transition",
                                status === "completed" && "bg-accent text-black",
                                status === "active" &&
                                "bg-primary text-accent-foreground",
                                !enabled && "cursor-not-allowed opacity-70",
                              )}
                              onClick={() => handleProblemClick(problem)}
                            >
                              {status === "completed" ? <Check /> : <Play />}
                            </Button>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold">
                                {problem.problem_name}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge
                                  variant={difficultyVariant(problem.difficulty)}
                                >
                                  {problem.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              asChild
                              disabled={!enabled}
                              size="icon"
                              variant="ghost"
                            >
                              <Link
                                to={
                                  enabled
                                    ? `/learn/${problem.problem_id}/revision`
                                    : "#"
                                }
                              >
                                <BookOpen className="size-4" />
                              </Link>
                            </Button>
                          </Card>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
