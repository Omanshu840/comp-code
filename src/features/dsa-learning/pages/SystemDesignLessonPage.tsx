import {
  X,
  Lightbulb,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers,
  FlaskConical,
  BookOpenCheck,
  Flag,
} from "lucide-react"
import { useState, useCallback } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import {
  getLectureAndLesson,
  buildSystemDesignCards,
  isInteractiveItem,
} from "../utils/system-design-content"
import { useLessonCompletion } from "../hooks/use-progress"
import { useSound } from "../hooks/use-sound"
import type {
  SystemDesignCard,
  QuizItem,
  MatchItem,
  OrderingItem,
} from "../types/system-design-types"
import { LessonCompletionDialog } from "../components/LessonCompletionDialog"

// ─── Difficulty badge colour ──────────────────────────────────────────────────

function difficultyVariant(d: string) {
  if (d === "beginner") return "secondary" as const
  if (d === "intermediate") return "outline" as const
  return "danger" as const
}

// ─── Section label pill ───────────────────────────────────────────────────────

function SectionPill({
  icon,
  label,
  of,
  total,
}: {
  icon: React.ReactNode
  label: string
  of: number
  total: number
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {icon}
      <span>
        {label} {of}/{total}
      </span>
    </div>
  )
}

// ─── Feedback banner ──────────────────────────────────────────────────────────

function FeedbackBanner({
  correct,
  explanation,
}: {
  correct: boolean
  explanation: string
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        correct
          ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300"
          : "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
      )}
    >
      {correct ? (
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
      ) : (
        <XCircle className="mt-0.5 size-5 shrink-0" />
      )}
      <div>
        <div className="font-semibold">{correct ? "Correct!" : "Not quite"}</div>
        <p className="mt-1 text-sm leading-6 opacity-90">{explanation}</p>
      </div>
    </div>
  )
}

// ─── MCQ / Scenario / Fill-blank card ────────────────────────────────────────

function ChoiceQuizCard({
  item,
  onAnswer,
  answered,
  selectedIndex,
}: {
  item: QuizItem & {
    options: string[]
    correctAnswerIndex: number
    explanation: string
  }
  onAnswer: (index: number) => void
  answered: boolean
  selectedIndex: number | null
}) {
  return (
    <div className="space-y-4">
      <p className="text-base font-medium leading-7">{item.prompt}</p>
      <div className="grid gap-3">
        {item.options.map((option, i) => {
          const isSelected = selectedIndex === i
          const isCorrect = i === item.correctAnswerIndex
          let variant: string = "border-border bg-background hover:bg-muted"
          if (answered) {
            if (isCorrect) variant = "border-green-500 bg-green-500/10"
            else if (isSelected && !isCorrect)
              variant = "border-rose-500 bg-rose-500/10"
          } else if (isSelected) {
            variant = "border-primary bg-primary/10"
          }
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => onAnswer(i)}
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 p-4 text-left text-sm transition-colors",
                variant,
                !answered && "cursor-pointer",
                answered && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border-2 text-xs font-bold",
                  answered && isCorrect && "border-green-500 text-green-600",
                  answered &&
                  isSelected &&
                  !isCorrect &&
                  "border-rose-500 text-rose-600",
                  !answered && isSelected && "border-primary text-primary",
                  !answered &&
                  !isSelected &&
                  "border-border text-muted-foreground",
                  answered &&
                  !isCorrect &&
                  !isSelected &&
                  "border-border text-muted-foreground",
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          )
        })}
      </div>
      {answered && (
        <FeedbackBanner
          correct={selectedIndex === item.correctAnswerIndex}
          explanation={item.explanation}
        />
      )}
    </div>
  )
}

// ─── True / False card ────────────────────────────────────────────────────────

function TrueFalseCard({
  item,
  onAnswer,
  answered,
  selected,
}: {
  item: QuizItem & { correctAnswer: boolean; explanation: string }
  onAnswer: (value: boolean) => void
  answered: boolean
  selected: boolean | null
}) {
  const options = [true, false] as const
  return (
    <div className="space-y-4">
      <p className="text-base font-medium leading-7">{item.prompt}</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((value) => {
          const label = value ? "True" : "False"
          const isSelected = selected === value
          const isCorrect = value === item.correctAnswer
          let variant = "border-border bg-background hover:bg-muted"
          if (answered) {
            if (isCorrect) variant = "border-green-500 bg-green-500/10"
            else if (isSelected) variant = "border-rose-500 bg-rose-500/10"
          } else if (isSelected) {
            variant = "border-primary bg-primary/10"
          }
          return (
            <button
              key={label}
              disabled={answered}
              onClick={() => onAnswer(value)}
              className={cn(
                "rounded-lg border-2 p-4 text-sm font-semibold transition-colors",
                variant,
                !answered && "cursor-pointer",
                answered && "cursor-default",
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
      {answered && (
        <FeedbackBanner
          correct={selected === item.correctAnswer}
          explanation={item.explanation}
        />
      )}
    </div>
  )
}

// ─── Match card ───────────────────────────────────────────────────────────────

function MatchCard({ item }: { item: MatchItem }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="space-y-4">
      <p className="text-base font-medium leading-7">{item.prompt}</p>
      {revealed ? (
        <div className="space-y-2">
          {item.pairs.map((pair) => (
            <div
              key={pair.left}
              className="flex items-start gap-3 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm"
            >
              <span className="shrink-0 font-semibold text-green-700 dark:text-green-300">
                {pair.left}
              </span>
              <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">{pair.right}</span>
            </div>
          ))}
          <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
            {item.explanation}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-2">
            {item.pairs.map((pair) => (
              <div
                key={pair.left}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm"
              >
                <span className="font-semibold">{pair.left}</span>
                <span className="ml-auto text-muted-foreground">???</span>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setRevealed(true)}
          >
            Reveal matches
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Ordering card ────────────────────────────────────────────────────────────

function OrderingCard({ item }: { item: OrderingItem }) {
  const [revealed, setRevealed] = useState(false)
  // Shuffle items for the challenge view
  const [shuffled] = useState(() =>
    [...item.items].sort(() => Math.random() - 0.5),
  )

  return (
    <div className="space-y-4">
      <p className="text-base font-medium leading-7">{item.prompt}</p>
      {revealed ? (
        <div className="space-y-2">
          {item.correctOrder.map((step, i) => (
            <div
              key={step}
              className="flex items-center gap-3 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-green-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
          <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
            {item.explanation}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-2">
            {shuffled.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setRevealed(true)}
          >
            Reveal correct order
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Generic quiz card dispatcher ────────────────────────────────────────────

function QuizCardContent({
  item,
  onAnswer,
  answered,
  answerValue,
}: {
  item: QuizItem
  onAnswer: (v: number | boolean) => void
  answered: boolean
  answerValue: number | boolean | null
}) {
  switch (item.type) {
    case "mcq":
    case "fill_blank":
    case "scenario":
      return (
        <ChoiceQuizCard
          item={item}
          onAnswer={(i) => onAnswer(i)}
          answered={answered}
          selectedIndex={typeof answerValue === "number" ? answerValue : null}
        />
      )
    case "true_false":
      return (
        <TrueFalseCard
          item={item}
          onAnswer={(v) => onAnswer(v)}
          answered={answered}
          selected={typeof answerValue === "boolean" ? answerValue : null}
        />
      )
    case "match":
      return <MatchCard item={item} />
    case "ordering":
      return <OrderingCard item={item} />
    default:
      return null
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SystemDesignLessonPage() {
  const { problemId } = useParams()
  const navigate = useNavigate()
  const { addProgress, updateStreak } = useLessonCompletion()

  const playNav = useSound("/sounds/navigation.mp3")
  const playSuccess = useSound("/sounds/correct-answer.wav")
  const playError = useSound("/sounds/wrong-answer.wav")
  const playComplete = useSound("/sounds/success.mp3")

  const result = getLectureAndLesson(problemId ?? "")

  const [cardIndex, setCardIndex] = useState(0)
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false)
  const [isStreakUpdated, setStreakUpdated] = useState(false);

  // Quiz interaction state (reset on each new quiz card)
  const [answered, setAnswered] = useState(false)
  const [answerValue, setAnswerValue] = useState<number | boolean | null>(null)

  if (!result) return <Navigate replace to="/" />

  const { lecture, lesson } = result
  const cards = buildSystemDesignCards(lesson)
  const progress = ((cardIndex + 1) / cards.length) * 100
  const currentCard = cards[cardIndex]

  // Whether the Continue button should be enabled
  const canContinue = useCallback(() => {
    if (currentCard.type === "quick_check" || currentCard.type === "practice") {
      if (isInteractiveItem(currentCard.item)) return answered
      // match / ordering: always continuable (reveal is optional)
      return true
    }
    return true
  }, [currentCard, answered])

  function handleAnswer(value: number | boolean) {
    if (answered) return
    setAnswerValue(value)
    setAnswered(true)

    if (currentCard.type === "quick_check" || currentCard.type === "practice") {
      const { item } = currentCard
      if (isInteractiveItem(item)) {
        let isCorrect = false
        if (
          item.type === "mcq" ||
          item.type === "fill_blank" ||
          item.type === "scenario"
        ) {
          isCorrect = value === item.correctAnswerIndex
        } else if (item.type === "true_false") {
          isCorrect = value === item.correctAnswer
        }

        if (isCorrect) {
          playSuccess()
        } else {
          playError()
        }
      }
    }
  }

  function continueLesson() {
    window.scrollTo(0, 0)
    if (cardIndex === cards.length - 1) {
      playComplete()
      addProgress(lesson.id)
      updateStreak(undefined, {
        onSuccess: (data) => {
          if (data?.updated) {
            setStreakUpdated(true);
          }
          setIsCompletionDialogOpen(true);
        },
      })
      return
    } else {
      playNav()
    }
    // Reset quiz state for the next card
    setAnswered(false)
    setAnswerValue(null)
    setCardIndex((v) => Math.min(v + 1, cards.length - 1))
  }

  function handleDialogClose() {
    setIsCompletionDialogOpen(false)
    navigate("/")
  }

  // ── Render each card type ────────────────────────────────────────────────

  function renderCard(card: SystemDesignCard) {
    switch (card.type) {
      // ── Intro ──────────────────────────────────────────────────────────
      case "intro":
        return (
          <Card className="border-border/80">
            <CardContent className="space-y-6 p-6">
              <Badge variant={difficultyVariant(lecture.difficulty)}>
                {lecture.difficulty}
              </Badge>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {lecture.title}
                </div>
                <h1 className="mt-2 text-2xl font-semibold">
                  {card.lesson.title}
                </h1>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 shrink-0" />
                {card.lesson.estimatedMinutes} min
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 size-5 shrink-0 text-fuchsia-500" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Goal
                    </div>
                    <p className="mt-1 text-sm leading-6">{card.lesson.goal}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  What you'll cover
                </div>
                <ul className="space-y-2">
                  {card.lesson.concepts.map((c) => (
                    <li
                      key={c.name}
                      className="flex items-start gap-2 text-sm leading-6"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-fuchsia-500" />
                      {c.name}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      // ── Teaching card ──────────────────────────────────────────────────
      case "teaching":
        return (
          <Card className="border-border/80">
            <CardContent className="space-y-6 p-6">
              <SectionPill
                icon={<Lightbulb className="size-4" />}
                label="Concept"
                of={card.index}
                total={card.total}
              />

              {card.card.type === "timeline" && (
                <div className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-300">
                  Timeline
                </div>
              )}

              <h2 className="text-xl font-semibold">{card.card.title}</h2>
              <p className="text-sm leading-8 text-muted-foreground">
                {card.card.body}
              </p>

              <div className="flex items-start gap-3 rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/5 p-4">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-fuchsia-500" />
                <p className="text-sm font-medium leading-6">
                  {card.card.takeaway}
                </p>
              </div>
            </CardContent>
          </Card>
        )

      // ── Visual model card ───────────────────────────────────────────────
      case "visual":
        return (
          <Card className="border-border/80">
            <CardContent className="space-y-6 p-6">
              <SectionPill
                icon={<Layers className="size-4" />}
                label="Diagram"
                of={card.index}
                total={card.total}
              />

              <h2 className="text-xl font-semibold">{card.model.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {card.model.description}
              </p>

              {/* Flow steps */}
              <div className="relative space-y-0">
                {card.model.flow.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-fuchsia-500 bg-background text-xs font-bold text-fuchsia-600 dark:text-fuchsia-300">
                        {i + 1}
                      </div>
                      {i < card.model.flow.length - 1 && (
                        <div
                          className="mt-1 w-px flex-1 bg-border"
                          style={{ minHeight: 24 }}
                        />
                      )}
                    </div>
                    <p className="pb-4 pt-0.5 text-sm leading-6">{step}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Notice:{" "}
                  </span>
                  {card.model.learnerShouldNotice}
                </p>
              </div>
            </CardContent>
          </Card>
        )

      // ── Quick check card ────────────────────────────────────────────────
      case "quick_check":
        return (
          <Card className="border-border/80">
            <CardContent className="space-y-6 p-6">
              <SectionPill
                icon={<FlaskConical className="size-4" />}
                label="Quick check"
                of={card.index}
                total={card.total}
              />
              <QuizCardContent
                item={card.item}
                onAnswer={handleAnswer}
                answered={answered}
                answerValue={answerValue}
              />
            </CardContent>
          </Card>
        )

      // ── Practice card ───────────────────────────────────────────────────
      case "practice":
        return (
          <Card className="border-border/80">
            <CardContent className="space-y-6 p-6">
              <SectionPill
                icon={<BookOpenCheck className="size-4" />}
                label="Practice"
                of={card.index}
                total={card.total}
              />
              <QuizCardContent
                item={card.item}
                onAnswer={handleAnswer}
                answered={answered}
                answerValue={answerValue}
              />
            </CardContent>
          </Card>
        )

      // ── Checkpoint card ─────────────────────────────────────────────────
      case "checkpoint":
        return (
          <Card className="border-border/80">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <Flag className="size-4" />
                Checkpoint
              </div>

              <h2 className="text-xl font-semibold">Lesson summary</h2>
              <p className="text-sm leading-8 text-muted-foreground">
                {card.checkpoint.summary}
              </p>

              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  You can now
                </div>
                <ul className="space-y-2">
                  {card.checkpoint.learnerCanNow.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-6"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/5 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-600 dark:text-fuchsia-300">
                  Explain in your own words
                </div>
                <p className="text-sm leading-6">
                  {card.checkpoint.explainInYourOwnWords}
                </p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="bg-background text-foreground">
      <LessonCompletionDialog
        isOpen={isCompletionDialogOpen}
        onClose={handleDialogClose}
        isStreakUpdated={isStreakUpdated}
        problem={{ problem_id: lesson.id, problem_name: lesson.title}}
      />
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
        <Button aria-label="Exit lesson" asChild size="icon" variant="ghost">
          <Link to="/">
            <X className="size-5" />
          </Link>
        </Button>

        <div className="h-3 flex-1 border border-border">
          <div
            className="h-full bg-fuchsia-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
          {cardIndex + 1} / {cards.length}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="overflow-y-auto px-4 py-6 pb-20">
        <section className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-8">
          {renderCard(currentCard)}
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="fixed inset-x-0 bottom-0 flex h-16 items-center justify-end border-t border-border bg-background px-4">
        <Button
          className="min-w-32 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40"
          disabled={!canContinue()}
          onClick={continueLesson}
        >
          {cardIndex === cards.length - 1 ? "Finish" : "Continue"}
        </Button>
      </footer>
    </div>
  )
}