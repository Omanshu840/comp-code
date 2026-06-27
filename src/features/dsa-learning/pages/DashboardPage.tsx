import { BookOpen, Check, ChevronDown, Flame, Play } from "lucide-react"
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

import { getTrackPreview } from "../content"
import { getSystemDesignTrackPreview, type SystemDesignTrackItem } from "../utils/system-design-content"
import type { DsaProblem } from "../content"
import { useDsaProgress, useDsaStreak } from "../hooks/use-progress"
import { difficultyVariant, getActiveProblemId, getProblemStatus } from "../utils"

// ─── Track type ───────────────────────────────────────────────────────────────

type Track = "DSA" | "System Design"

const TRACK_STORAGE_KEY = "preferred_track"

function readStoredTrack(): Track {
  try {
    const stored = localStorage.getItem(TRACK_STORAGE_KEY)
    if (stored === "DSA" || stored === "System Design") return stored
  } catch {
    // localStorage unavailable (e.g. SSR / private browsing)
  }
  return "DSA"
}

function writeStoredTrack(track: Track) {
  try {
    localStorage.setItem(TRACK_STORAGE_KEY, track)
  } catch {
    // ignore
  }
}

// ─── Colour maps ──────────────────────────────────────────────────────────────

const bgColor = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  rose: "bg-rose-500",
  indigo: "bg-indigo-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
  lime: "bg-lime-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  pink: "bg-pink-500",
} as const

const bgOpacityColor = {
  blue: "bg-blue-500/10",
  green: "bg-green-500/10",
  purple: "bg-purple-500/10",
  fuchsia: "bg-fuchsia-500/10",
  rose: "bg-rose-500/10",
  indigo: "bg-indigo-500/10",
  teal: "bg-teal-500/10",
  cyan: "bg-cyan-500/10",
  emerald: "bg-emerald-500/10",
  lime: "bg-lime-500/10",
  amber: "bg-amber-500/10",
  sky: "bg-sky-500/10",
  violet: "bg-violet-500/10",
  pink: "bg-pink-500/10",
} as const

const colorKeys = Object.keys(bgColor) as (keyof typeof bgColor)[]

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const tracks: { name: Track; icon: React.ReactNode }[] = [
    { name: "DSA", icon: <BookOpen className="size-8" /> },
    { name: "System Design", icon: <BookOpen className="size-8" /> },
  ]

  // Initialise from localStorage so the user's last choice persists across
  // page reloads and sessions.
  const [trackType, setTrackType] = useState<Track>(readStoredTrack)
  const [isTrackSwitcherOpen, setIsTrackSwitcherOpen] = useState(false)

  const { progress } = useDsaProgress()
  const completed = useMemo(
    () => new Set(progress?.map((p) => p.problem_id) ?? []),
    [progress],
  )
  const { streak } = useDsaStreak()
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
        activeProblemRef.current.scrollIntoView({ block: "center" })
      }
    }, 300)
  }, [activeId])

  const groupedProblems = useMemo(() => {
    return track.reduce(
      (acc, problem) => {
        const { categoryName, subcategoryName } = problem
        if (!acc[categoryName]) acc[categoryName] = {}
        if (!acc[categoryName][subcategoryName]) acc[categoryName][subcategoryName] = []
        acc[categoryName][subcategoryName].push(problem as DsaProblem)
        return acc
      },
      {} as Record<string, Record<string, DsaProblem[]>>,
    )
  }, [track])

  const handleProblemClick = (problem: DsaProblem | SystemDesignTrackItem) => {
    if(trackType === "DSA") {
      navigate(`/${problem.problem_id}/lesson`)
    } else if(trackType === "System Design") {
      navigate(`/system-design/${problem.problem_id}/lesson`)
    }
  }
  
  const handleTrackChange = (newTrack: Track) => {
    setTrackType(newTrack)
    writeStoredTrack(newTrack)
    setIsTrackSwitcherOpen(false)
  }

  return (
    <div className="relative space-y-8 rounded-lg">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 flex flex-col gap-4">
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

          <div className="flex items-center gap-2">
            <Flame className="size-5 text-orange-500" />
            <span className="font-bold text-lg">{streak?.streak ?? 0}</span>
          </div>
        </div>

        {activeProblem && (
          <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col bg-card p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="whitespace-pre-wrap break-words text-xs text-muted-foreground">
                    {activeProblem.categoryName} &gt; {activeProblem.subcategoryName}
                  </div>
                  <h1 className="whitespace-pre-wrap break-words text-lg font-semibold truncate">
                    {activeProblem.problem_name}
                  </h1>
                </div>
                <Button className="shrink-0" onClick={() => handleProblemClick(activeProblem)}>
                  <Play className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Track list ── */}
      <div>
        <section className="relative mx-auto" id="track">
          <div>
            {Object.entries(groupedProblems).map(([categoryName, subcategories], index) => {
              const baseColor = colorKeys[index % colorKeys.length]
              return (
                <div
                  key={categoryName}
                  className={cn(
                    "relative space-y-8 rounded-lg p-4 py-8",
                    bgOpacityColor[baseColor],
                  )}
                >
                  <div className="z-10 text-center mb-8">
                    <div
                      className={cn(
                        "inline-flex items-center rounded-lg px-4 py-3 text-lg font-bold text-white",
                        bgColor[baseColor],
                      )}
                    >
                      {categoryName}
                    </div>
                  </div>

                  {Object.entries(subcategories).map(([subcategoryName, problems]) => (
                    <div key={subcategoryName} className="relative">
                      <div className="z-10 h-0 text-center">
                        <div className="inline-block rounded-full border-2 border-primary bg-background px-3 py-1 text-sm font-semibold text-primary">
                          {subcategoryName}
                        </div>
                      </div>

                      <div className="space-y-4 pt-16">
                        {problems.map((problem) => {
                          const status = getProblemStatus(problem, completed, activeId)
                          const enabled =
                            problem.approaches.length > 0 || trackType === "System Design"
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
                                    status === "active" && "bg-primary text-background",
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
                                    <Badge variant={difficultyVariant(problem.difficulty)}>
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
                                    to={trackType === "DSA" ? `/${problem.problem_id}/revision` : `/system-design/${problem.problem_id}/revision`}
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
                  ))}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
