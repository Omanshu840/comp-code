import {
  BookOpen,
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
  type Approach,
} from "../content"
import { useLessonCompletion } from "../hooks/use-progress"
import { useSound } from "../hooks/use-sound"
import { difficultyVariant } from "../utils"
import { ImageCarousel } from "../components/ImageCarousel"
import { CodeBlock } from "../components/CodeBlock"

// Each approach is split into 3 sub-steps
const APPROACH_STEPS = ["approach", "code", "complexity"] as const

type CardItem =
  | { type: "problem" }
  | { type: (typeof APPROACH_STEPS)[number]; approach: Approach }
  | { type: "done" }

// Build the full card sequence:
// [0] = Problem
// [1..N*3] = for each approach: approach card, code card, complexity card
// [last] = Done
function buildCards(approaches: Approach[]): CardItem[] {
  const cards: CardItem[] = [{ type: "problem" }]
  for (const approach of approaches) {
    for (const step of APPROACH_STEPS) {
      cards.push({ type: step, approach })
    }
  }
  cards.push({ type: "done" })
  return cards
}

const STEP_LABELS = {
  approach: "Approach",
  code: "Code",
  complexity: "Complexity",
}

const STEP_SUBTITLES = {
  approach: "The idea",
  code: "Implementation",
  complexity: "Cost of the idea",
}

export function LessonPage() {
  const { problemId } = useParams()
  const navigate = useNavigate()
  // Only exposes mutation functions — no useQuery calls, so no extra network
  // requests fire when the lesson mounts. Progress and streak data are already
  // cached from the Dashboard.
  const { addProgress, updateStreak } = useLessonCompletion()
  const problem = getProblemById(problemId)
  const [card, setCard] = useState(0)
  const playNavigationSound = useSound("/sounds/navigation.mp3")
  const playSuccessSound = useSound("/sounds/success.mp3")

  if (!problem || !problem.problem) {
    return <Navigate replace to="/" />
  }

  const cards = buildCards(problem.approaches)
  const progress = ((card + 1) / cards.length) * 100
  const currentCard = cards[card]

  function continueLesson() {
    window.scrollTo(0, 0)
    if (card === cards.length - 1 && problem) {
      addProgress(problem.problem_id)
      updateStreak()
      navigate("/")
      return
    }
    if(card === cards.length - 2) {
      playSuccessSound()
    } else {
      playNavigationSound()
    }
    setCard((v) => Math.min(v + 1, cards.length - 1))
  }

  // Step indicator for approach sub-steps
  function StepIndicator({
    activeStep,
  }: {
    activeStep: (typeof APPROACH_STEPS)[number]
  }) {
    return (
      <div className="flex items-center gap-1">
        {APPROACH_STEPS.map((step) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full transition-all ${
              step === activeStep ? "bg-fuchsia-500" : "bg-border"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
        <Button aria-label="Exit lesson" asChild size="icon" variant="ghost">
          <Link to="/">
            <X className="size-5" />
          </Link>
        </Button>
        <div className="h-3 flex-1 border border-border">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
          {card + 1} / {cards.length}
        </div>
      </header>

      <main className="overflow-y-auto px-4 py-6 pb-20">
        <section className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-8">
          {/* ── Problem card ── */}
          {currentCard.type === "problem" && (
            <Card className="border-border/80">
              <CardContent className="space-y-6 p-6">
                <Badge variant={difficultyVariant(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
                <div>
                  <h1 className="text-2xl font-semibold">
                    {problem.problem_name}
                  </h1>
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
                    <Card
                      key={`${example.input}-${index}`}
                      className="border-border/80"
                    >
                      <CardContent className="space-y-3 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Example {index + 1}
                        </div>
                        <pre className="whitespace-pre-wrap break-words bg-muted p-4 font-mono text-xs leading-6 text-foreground">
                          {`Input: ${example.input}
Output: ${example.output}${
                            example.explanation
                              ? `
${example.explanation}`
                              : ""
                          }`}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Approach sub-step: "approach" ── */}
          {currentCard.type === "approach" && (
            <Card className="border-border/80">
              <CardContent className="space-y-6 p-6">
                <StepIndicator activeStep="approach" />
                <div className="text-xl font-semibold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-fuchsia-300">
                  {currentCard.approach.name}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {STEP_LABELS.approach}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold">
                    {STEP_SUBTITLES.approach}
                  </h2>
                  <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground">
                    {cleanScrapedText(
                      currentCard.approach.intuition_and_algorithm,
                    )}
                  </p>
                </div>
                {currentCard.approach.images?.length ? (
                  <ImageCarousel images={currentCard.approach.images} />
                ) : null}
                {problem.article ? (
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={problem.article}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      <ExternalLink className="size-4" />
                      Learn more
                    </a>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* ── Approach sub-step: "code" ── */}
          {currentCard.type === "code" && (
            <Card className="border-border/80">
              <CardContent className="space-y-6 p-6">
                <StepIndicator activeStep="code" />
                <div className="text-xl font-semibold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-fuchsia-300">
                  {currentCard.approach.name}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {STEP_LABELS.code}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold">
                    {STEP_SUBTITLES.code}
                  </h2>
                </div>
                <CodeBlock approach={currentCard.approach} />
              </CardContent>
            </Card>
          )}

          {/* ── Approach sub-step: "complexity" ── */}
          {currentCard.type === "complexity" && (
            <Card className="border-border/80">
              <CardContent className="space-y-6 p-6">
                <StepIndicator activeStep="complexity" />
                <div className="text-xl font-semibold uppercase tracking-[0.18em] text-fuchsia-600 dark:text-fuchsia-300">
                  {currentCard.approach.name}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {STEP_LABELS.complexity}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold">
                    {STEP_SUBTITLES.complexity}
                  </h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="border border-border p-5">
                      <div className="text-sm font-semibold">Time</div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                        {cleanScrapedText(
                          currentCard.approach.complexities?.time,
                        )}
                      </p>
                    </div>
                    <div className="border border-border p-5">
                      <div className="text-sm font-semibold">Space</div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                        {cleanScrapedText(
                          currentCard.approach.complexities?.space,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Done card ── */}
          {currentCard.type === "done" && (
            <div className="text-center">
              <div className="mx-auto grid size-24 place-items-center border border-foreground bg-lime-300 text-black shadow-[6px_6px_0_#000]">
                <Trophy className="size-12" />
              </div>
              <h1 className="mt-8 text-4xl font-semibold">Lesson complete</h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {problem.problem_name} is now marked complete on your path.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 flex h-16 items-center justify-end border-t border-border bg-background px-4">
        <Button
          className="min-w-32 bg-foreground text-background hover:bg-foreground/90"
          onClick={continueLesson}
        >
          {card === cards.length - 1 ? "Finish" : "Continue"}
        </Button>
      </footer>
    </div>
  )
}
