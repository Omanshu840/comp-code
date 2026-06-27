/**
 * SystemDesignRevisionPage.tsx
 *
 * Shown when the user taps the BookOpen icon on a System Design lesson card.
 * Displays flashcards, glossary, and the final quiz for the parent lecture.
 */

import { BookOpen, ChevronLeft, ChevronRight, X, RotateCcw } from "lucide-react"
import { useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { getLectureAndLesson } from "../utils/system-design-content"
import type { Flashcard, GlossaryEntry } from "../types/system-design-types"

// ─── Flashcard viewer ─────────────────────────────────────────────────────────

function FlashcardViewer({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = cards[index]

  function next() {
    setFlipped(false)
    setIndex((i) => Math.min(i + 1, cards.length - 1))
  }
  function prev() {
    setFlipped(false)
    setIndex((i) => Math.max(i - 1, 0))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{card.category}</span>
        <span>
          {index + 1} / {cards.length}
        </span>
      </div>

      {/* Card face */}
      <button
        className="w-full text-left"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show question" : "Reveal answer"}
      >
        <Card
          className={cn(
            "min-h-44 border-2 transition-colors",
            flipped ? "border-fuchsia-500/50 bg-fuchsia-500/5" : "border-border",
          )}
        >
          <CardContent className="flex h-full min-h-44 flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {flipped ? "Answer" : "Question"}
            </div>
            <p className="text-base leading-7">{flipped ? card.back : card.front}</p>
            {!flipped && (
              <div className="mt-2 text-xs text-muted-foreground">Tap to reveal answer</div>
            )}
          </CardContent>
        </Card>
      </button>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prev} disabled={index === 0}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIndex(0)
            setFlipped(false)
          }}
        >
          <RotateCcw className="mr-2 size-4" />
          Restart
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          disabled={index === cards.length - 1}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Glossary list ────────────────────────────────────────────────────────────

function GlossaryList({ entries }: { entries: GlossaryEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <Card key={entry.term} className="border-border/80">
          <CardContent className="p-4">
            <div className="font-semibold">{entry.term}</div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.definition}</p>
            {entry.relatedConcepts.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {entry.relatedConcepts.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = "flashcards" | "glossary"

export function SystemDesignRevisionPage() {
  const { problemId } = useParams()
  const result = getLectureAndLesson(problemId ?? "")
  const [tab, setTab] = useState<Tab>("flashcards")

  if (!result) return <Navigate replace to="/" />
  const { lecture } = result

  const { flashcards, glossary } = lecture.revision

  return (
    <div className="bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
        <Button aria-label="Back" asChild size="icon" variant="ghost">
          <Link to="/">
            <X className="size-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <BookOpen className="size-4 shrink-0 text-fuchsia-500" />
          <span className="truncate text-sm font-semibold">{lecture.title}</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 pb-20">
        {/* ── Tab switcher ── */}
        <div className="mb-6 grid grid-cols-2 rounded-lg border border-border p-1">
          {(["flashcards", "glossary"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md py-2 text-sm font-semibold capitalize transition-colors",
                tab === t
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "flashcards" && <FlashcardViewer cards={flashcards} />}
        {tab === "glossary" && <GlossaryList entries={glossary} />}
      </main>
    </div>
  )
}