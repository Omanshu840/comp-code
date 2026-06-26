import { BookOpen, Check, ChevronDown, Play } from "lucide-react"
import { useMemo, useRef, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { getTrackPreview, getSystemDesignTrackPreview } from "../content"
import type { DsaProblem } from "../content"
import { useCompletedProblems } from "../hooks/useCompletedProblems"
import { difficultyVariant, getActiveProblemId, getProblemStatus } from "../utils"

type Track = "DSA" | "System Design"

export function DashboardPage() {
  const tracks: { name: Track; icon: React.ReactNode }[] = [
    { name: "DSA", icon: <BookOpen className="size-8" /> },
    { name: "System Design", icon: <BookOpen className="size-8" /> },
  ]

  const [trackType, setTrackType] = useState<Track>("DSA")
  const [isTrackSwitcherOpen, setIsTrackSwitcherOpen] = useState(false)

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
    navigate(`/${problem.problem_id}/lesson`)
  }

  const handleTrackChange = (newTrack: Track) => {
    setTrackType(newTrack)
    setIsTrackSwitcherOpen(false)
  }

  return (
    <div className="w-full">
      <header className="sticky top-0 z-30 flex flex-col gap-4">
        <div className="flex items-center justify-between bg-background px-2 py-2 sm:px-6 lg:px-8">
          <Dialog open={isTrackSwitcherOpen} onOpenChange={setIsTrackSwitcherOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>{trackType}</span>
                <ChevronDown className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="top-20 translate-y-0 sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Switch course</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {tracks.map((track) => (
                  <button
                    key={track.name}
                    onClick={() => handleTrackChange(track.name)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-colors",
                      trackType === track.name
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    {track.icon}
                    <span className="font-semibold">{track.name}</span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
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
                          className={cn(
                            "relative flex justify-center transition-all duration-300",
                            status !== "active" && "scale-95 opacity-70",
                          )}
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
                                    ? `/${problem.problem_id}/revision`
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
