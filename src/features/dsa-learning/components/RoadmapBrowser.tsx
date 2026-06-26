import { ChevronRight } from "lucide-react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { dsaCategories, type DsaProblem } from "../content"
import { useMediaQuery } from "@/hooks/use-media-query"
import { difficultyVariant, getProblemStatus, isValidExternalLink } from "../utils"

export function RoadmapBrowser({ completed, activeId, markCompleted }: { completed: Set<string>; activeId: string, markCompleted: (problemId: string) => void }) {
  const [selectedProblem, setSelectedProblem] = useState<DsaProblem | null>(null)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  return (
    <section className="mt-10" id="roadmap">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold">Roadmap browser</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Browse the structured roadmap from <code>scrapper/structures/roadmap.json</code> and open any lesson or revision directly.
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 lg:gap-8">
        <div className="space-y-6">
          {dsaCategories.map((category) => (
            <Card key={category.id} className="border-border/70 bg-background/80">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.subcategories.length} units · {category.subcategories.reduce((sum, sub) => sum + sub.problems.length, 0)} lessons
                    </p>
                  </div>
                  <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    roadmap
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {category.subcategories.map((subcategory) => (
                    <details className="group overflow-hidden rounded-3xl border border-border bg-muted p-4" key={subcategory.id}>
                      <summary className="flex cursor-pointer items-center justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold">{subcategory.name}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {subcategory.problems.length} lessons
                          </p>
                        </div>
                        <ChevronRight className="size-5 transition-transform duration-200 group-open:rotate-90" />
                      </summary>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {subcategory.problems.map((problem) => {
                          const status = getProblemStatus(problem, completed, activeId)
                          const hasLesson = Boolean(problem.problem && problem.approaches.length)

                          return (
                            <div className="rounded-3xl border border-border bg-background p-4" key={problem.problem_id}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant={difficultyVariant(problem.difficulty)}>{problem.difficulty}</Badge>
                                    <p className="truncate text-sm font-semibold text-foreground">{problem.problem_name}</p>
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {isValidExternalLink(problem.article) && (
                                      <span className="rounded-full border border-border px-2 py-1">Article</span>
                                    )}
                                    {isValidExternalLink(problem.youtube) && (
                                      <span className="rounded-full border border-border px-2 py-1">Video</span>
                                    )}
                                    {isValidExternalLink(problem.leetcode) && (
                                      <span className="rounded-full border border-border px-2 py-1">LeetCode</span>
                                    )}
                                  </div>
                                </div>
                                <span className="rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                  {status}
                                </span>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {isDesktop ? (
                                  <Button onClick={() => setSelectedProblem(problem)} size="sm" variant="secondary" className="min-w-[8rem]">
                                    Read
                                  </Button>
                                ) : (
                                  <Button asChild size="sm" variant="secondary" className="min-w-[8rem]">
                                    <Link to={`/learn/roadmap/${problem.problem_id}`}>Read</Link>
                                  </Button>
                                )}
                                <Button asChild disabled={!hasLesson} size="sm" className="min-w-[8rem]" variant={hasLesson ? "default" : "outline"}>
                                  <Link to={hasLesson ? `/learn/${problem.problem_id}/lesson` : "#"}>
                                    {hasLesson ? "Lesson" : "Locked"}
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="hidden lg:block">
          {selectedProblem ? (
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{selectedProblem.problem_name}</h3>
                <div className="mt-4 prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{selectedProblem.problem?.problem_statement}</ReactMarkdown>
                </div>
                <Button onClick={() => markCompleted(selectedProblem.problem_id)} className="mt-4">Mark as Read</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-24 flex h-96 items-center justify-center">
              <p className="text-muted-foreground">Select a problem to read about it</p>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
