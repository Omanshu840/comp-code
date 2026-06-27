/**
 * system-design-content.ts
 *
 * Loads all lecture files from scrapper/system-design-content/lectures/,
 * exposes helpers to build the track preview (for DashboardPage) and to
 * retrieve individual lessons (for SystemDesignLessonPage).
 *
 * ─── How to add new lectures ─────────────────────────────────────────────────
 * 1. Drop the .js file into scrapper/system-design-content/lectures/
 * 2. Import it below and add it to the `allLectures` array.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type {
  SystemDesignLecture,
  SystemDesignLesson,
  SystemDesignCard,
  QuizItem,
} from "../types/system-design-types"

// ─── Import all lecture files ─────────────────────────────────────────────────
const lectureModules = import.meta.glob<{ lecture: SystemDesignLecture }>(
  "../content/system-design/lectures/lecture-*.ts",
  { eager: true },
);

export const allLectures: SystemDesignLecture[] = Object.entries(lectureModules)
  .sort(([pathA], [pathB]) => {
    const numA = parseInt(pathA.match(/lecture-(\d+)-/)?.[1] ?? "0", 10);
    const numB = parseInt(pathB.match(/lecture-(\d+)-/)?.[1] ?? "0", 10);
    return numA - numB;
  })
  .map(([, module]) => module.lecture as SystemDesignLecture);

// ─── Section metadata (colours, display names) ───────────────────────────────
const SECTION_META: Record<string, { name: string; categoryName: string }> = {
  "section-1-introduction": {
    name: "Introduction",
    categoryName: "Introduction",
  },
  // Add more sections as you scrape them
}

function sectionName(sectionId: string): string {
  return SECTION_META[sectionId]?.categoryName ?? sectionId
}

// ─── DashboardPage track preview ─────────────────────────────────────────────

/**
 * Returns the flat list of "problems" (lessons) that DashboardPage expects.
 * Each lecture can have multiple lessons; each lesson becomes one track item.
 */
export function getSystemDesignTrackPreview() {
  const items: SystemDesignTrackItem[] = []

  for (const lecture of allLectures) {
    const categoryName = sectionName(lecture.sectionId)
    for (const lesson of lecture.lessons) {
      items.push({
        problem_id: lesson.id,
        problem_name: lesson.title,
        difficulty: lecture.difficulty as "beginner" | "intermediate" | "advanced",
        categoryName,
        subcategoryName: lecture.title,
        lectureId: lecture.id,
        lessonOrder: lesson.order,
        estimatedMinutes: lesson.estimatedMinutes,
        approaches: [{}], // non-empty so the "enabled" guard in DashboardPage passes
      })
    }
  }

  return items
}

export interface SystemDesignTrackItem {
  problem_id: string
  problem_name: string
  difficulty: "beginner" | "intermediate" | "advanced"
  categoryName: string
  subcategoryName: string
  lectureId: string
  lessonOrder: number
  estimatedMinutes: number
  approaches: object[] // kept for DashboardPage compatibility
}

// ─── Lesson lookup ────────────────────────────────────────────────────────────

export function getLectureAndLesson(lessonId: string):
  | { lecture: SystemDesignLecture; lesson: SystemDesignLesson }
  | undefined {
  for (const lecture of allLectures) {
    const lesson = lecture.lessons.find((l) => l.id === lessonId)
    if (lesson) return { lecture, lesson }
  }
  return undefined
}

// ─── Card sequence builder ────────────────────────────────────────────────────

/**
 * Turns a lesson's structured data into a flat array of SystemDesignCards
 * that SystemDesignLessonPage can step through one at a time.
 *
 * Sequence:
 *   1. Intro card  (goal + estimated time)
 *   2. Teaching cards (concept / timeline)
 *   3. Visual model cards
 *   4. Quick-check cards (self-check quiz items)
 *   5. Practice cards (deeper exercises)
 *   6. Checkpoint card (summary + what you can now do)
 *   7. Done card
 */
export function buildSystemDesignCards(lesson: SystemDesignLesson): SystemDesignCard[] {
  const cards: SystemDesignCard[] = []

  // 1. Intro
  cards.push({ type: "intro", lesson })

  // 2. Teaching cards
  lesson.teachingCards.forEach((card, i) => {
    cards.push({
      type: "teaching",
      card,
      index: i + 1,
      total: lesson.teachingCards.length,
    })
  })

  // 3. Visual models
  lesson.visualModels.forEach((model, i) => {
    cards.push({
      type: "visual",
      model,
      index: i + 1,
      total: lesson.visualModels.length,
    })
  })

  // 4. Quick checks
  lesson.quickChecks.forEach((item, i) => {
    cards.push({
      type: "quick_check",
      item,
      index: i + 1,
      total: lesson.quickChecks.length,
    })
  })

  // 5. Practice items
  lesson.practice.forEach((item, i) => {
    cards.push({
      type: "practice",
      item,
      index: i + 1,
      total: lesson.practice.length,
    })
  })

  // 6. Checkpoint
  cards.push({ type: "checkpoint", checkpoint: lesson.checkpoint })

  // 7. Done
  cards.push({ type: "done" })

  return cards
}

// ─── Quiz helpers ─────────────────────────────────────────────────────────────

/** Returns true if the given answer index/value is correct for the item. */
export function checkAnswer(item: QuizItem, answer: number | boolean): boolean {
  switch (item.type) {
    case "mcq":
    case "fill_blank":
    case "scenario":
      return answer === item.correctAnswerIndex
    case "true_false":
      return answer === item.correctAnswer
    default:
      return false
  }
}

/** Returns whether this quiz item is "interactive" (needs an answer before continuing). */
export function isInteractiveItem(item: QuizItem): boolean {
  return ["mcq", "true_false", "fill_blank", "scenario"].includes(item.type)
}