import {
  BookOpen,
  Code2,
  ExternalLink,
  Trophy,
  Video,
  X,
} from "lucide-react"
import { useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import cleanScrapedText, {
  getProblemById,
} from "../content"
import { useCompletedProblems } from "../hooks/useCompletedProblems"
import { difficultyVariant } from "../utils"
import { ImageCarousel } from "../components/ImageCarousel"
import { CodeBlock } from "../components/CodeBlock"


export function LessonPage() {
  const { problemId } = useParams()
  const navigate = useNavigate()
  const { markCompleted } = useCompletedProblems()
  const problem = getProblemById(problemId)
  const [card, setCard] = useState(0)
  const [showCode, setShowCode] = useState(false)
  let LESSON_CARDS = problem?.approaches.map((approach) => approach.name) ?? [];
  LESSON_CARDS = ["Problem", ...LESSON_CARDS, "Done"]

  const progress = ((card + 1) / LESSON_CARDS.length) * 100

  if (!problem || !problem.problem) {
    return <Navigate replace to="/" />
  }

  const lessonProblem = problem

  function continueLesson() {
    if (card === LESSON_CARDS.length - 1) {
      markCompleted(lessonProblem.problem_id)
      navigate("/")
      return
    }

    setCard((value) => Math.min(value + 1, LESSON_CARDS.length - 1))
  }

  const approach = problem.approaches[card - 1] ?? {};

  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
        <Button aria-label="Exit lesson" asChild size="icon" variant="ghost">
          <Link to="/">
            <X className="size-5" />
          </Link>
        </Button>
        <div className="h-3 flex-1 border border-border">
          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
          {card + 1} / {LESSON_CARDS.length}
        </div>
      </header>

      <main className="overflow-y-auto px-4 py-6 pb-20">
        <section className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-8">
          {card === 0 ? (
            <Card className="border-border/80">
              <CardContent className="space-y-6 p-6">
                <Badge variant={difficultyVariant(problem.difficulty)}>{problem.difficulty}</Badge>
                <div>
                  <h1 className="text-2xl font-semibold">{problem.problem_name}</h1>
                  <p className="mt-4 text-sm leading-8 text-muted-foreground">
                    {cleanScrapedText(problem.problem.problem_statement)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {problem.article ? (
                    <a
                      href={problem.article}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      <ExternalLink className="size-4" />
                      Article
                    </a>
                  ) : null}
                  {problem.youtube ? (
                    <a
                      href={problem.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      <Video className="size-4" />
                      Video
                    </a>
                  ) : null}
                  {problem.leetcode && problem.leetcode !== "$undefined" ? (
                    <a
                      href={problem.leetcode}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      <BookOpen className="size-4" />
                      LeetCode
                    </a>
                  ) : null}
                </div>
                <div className="grid gap-3">
                  {problem.problem.examples.map((example, index) => (
                    <Card key={`${example.input}-${index}`} className="border-border/80">
                      <CardContent className="space-y-3 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Example {index + 1}
                        </div>
                        <pre className="whitespace-pre-wrap break-words bg-muted p-4 font-mono text-xs leading-6 text-foreground">
                          {`Input: ${example.input}
Output: ${example.output}${example.explanation ? `
${example.explanation}` : ""}`}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {card !== LESSON_CARDS.length - 1 && card!==0 ? (
            <Card className="border-border/80">
              <CardContent className="space-y-6 p-6">
                <div className="text-xl font-semibold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-fuchsia-300">
                  {approach.name}
                </div>
                <div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground">
                    {cleanScrapedText(approach.intuition_and_algorithm)}
                  </p>
                </div>
                {approach.images?.length ? <ImageCarousel images={approach.images} /> : null}
                <div className="flex flex-wrap gap-3">
                  {problem.article ? (
                    <a
                      href={problem.article}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      <ExternalLink className="size-4" />
                      Learn more
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    onClick={() => setShowCode((current) => !current)}
                  >
                    <Code2 className="size-4" />
                    {showCode ? "Hide code" : "View code"}
                  </button>
                </div>
                {showCode ? <CodeBlock approach={approach} /> : null}
                <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-fuchsia-300">
                Complexity
              </div>
              <h1 className="mt-3 text-xl font-semibold">Cost of the idea</h1>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="border border-border p-5">
                  <div className="text-sm font-semibold">Time</div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {cleanScrapedText(approach.complexities?.time)}
                  </p>
                </div>
                <div className="border border-border p-5">
                  <div className="text-sm font-semibold">Space</div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {cleanScrapedText(approach.complexities?.space)}
                  </p>
                </div>
              </div>
            </div>
              </CardContent>
            </Card>
          ) : null}

          {card === LESSON_CARDS.length - 1 ? (
            <div className="text-center">
              <div className="mx-auto grid size-24 place-items-center border border-foreground bg-lime-300 text-black shadow-[6px_6px_0_#000]">
                <Trophy className="size-12" />
              </div>
              <h1 className="mt-8 text-4xl font-semibold">Lesson complete</h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {problem.problem_name} is now marked complete on your path.
              </p>
            </div>
          ) : null}
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 flex h-16 items-center justify-end border-t border-border bg-background px-4">
        <Button
          className="min-w-32 bg-foreground text-background hover:bg-foreground/90"
          onClick={continueLesson}
        >
          {card === LESSON_CARDS.length - 1 ? "Finish" : "Continue"}
        </Button>
      </footer>
    </div>
  )
}
