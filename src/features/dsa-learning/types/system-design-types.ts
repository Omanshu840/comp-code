// ─── Teaching Card Types ─────────────────────────────────────────────────────

export interface ConceptCard {
  type: "concept"
  title: string
  body: string
  takeaway: string
}

export interface TimelineCard {
  type: "timeline"
  title: string
  body: string
  takeaway: string
}

export type TeachingCard = ConceptCard | TimelineCard

// ─── Quiz / Practice Item Types ──────────────────────────────────────────────

export interface MCQItem {
  type: "mcq"
  prompt: string
  options: string[]
  correctAnswerIndex: number
  correctAnswer?: boolean | null
  explanation: string
}

export interface TrueFalseItem {
  type: "true_false"
  prompt: string
  correctAnswer: boolean
  explanation: string
}

export interface FillBlankItem {
  type: "fill_blank"
  prompt: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
}

export interface MatchPair {
  left: string
  right: string
}

export interface MatchItem {
  type: "match"
  prompt: string
  pairs: MatchPair[]
  explanation: string
}

export interface OrderingItem {
  type: "ordering"
  prompt: string
  items: string[]
  correctOrder: string[]
  explanation: string
}

export interface ScenarioItem {
  type: "scenario"
  prompt: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
}

export type QuizItem =
  | MCQItem
  | TrueFalseItem
  | FillBlankItem
  | MatchItem
  | OrderingItem
  | ScenarioItem

// ─── Concept (deep explanation) ──────────────────────────────────────────────

export interface LessonConcept {
  name: string
  explanation: string
  whyItMatters: string
  systemDesignConnection: string
  example: string
  commonMisconception: string
}

// ─── Visual Model ─────────────────────────────────────────────────────────────

export interface VisualModel {
  title: string
  description: string
  flow: string[]
  learnerShouldNotice: string
}

// ─── Checkpoint ───────────────────────────────────────────────────────────────

export interface Checkpoint {
  summary: string
  learnerCanNow: string[]
  explainInYourOwnWords: string
}

// ─── Lesson ───────────────────────────────────────────────────────────────────

export interface SystemDesignLesson {
  id: string
  title: string
  goal: string
  order: number
  estimatedMinutes: number
  concepts: LessonConcept[]
  teachingCards: TeachingCard[]
  visualModels: VisualModel[]
  quickChecks: QuizItem[]
  practice: QuizItem[]
  checkpoint: Checkpoint
}

// ─── Revision ─────────────────────────────────────────────────────────────────

export interface Flashcard {
  front: string
  back: string
  category: string
}

export interface GlossaryEntry {
  term: string
  definition: string
  relatedConcepts: string[]
}

export interface Revision {
  flashcards: Flashcard[]
  glossary: GlossaryEntry[]
  finalQuiz: QuizItem[]
}

// ─── Interview Prep ───────────────────────────────────────────────────────────

export interface InterviewQuestion {
  question: string
  whatInterviewerLooksFor: string
  strongAnswer: string
  answerStructure: string[]
  commonMistakes: string[]
  followUps: string[]
}

export interface InterviewPrep {
  questions: InterviewQuestion[]
}

// ─── Lecture (top-level) ──────────────────────────────────────────────────────

export interface SystemDesignLecture {
  id: string
  sectionId: string
  lectureNumber: number
  title: string
  slug: string
  estimatedMinutes: number
  difficulty: "beginner" | "intermediate" | "advanced"
  prerequisites: string[]
  learningOutcomes: string[]
  lessons: SystemDesignLesson[]
  interviewPrep: InterviewPrep
  revision: Revision
}

// ─── Card sequence types (for the lesson player) ──────────────────────────────

export type SystemDesignCardType =
  | "intro"
  | "teaching"
  | "visual"
  | "quick_check"
  | "practice"
  | "checkpoint"
  | "done"

export type SystemDesignCard =
  | { type: "intro"; lesson: SystemDesignLesson }
  | { type: "teaching"; card: TeachingCard; index: number; total: number }
  | { type: "visual"; model: VisualModel; index: number; total: number }
  | { type: "quick_check"; item: QuizItem; index: number; total: number }
  | { type: "practice"; item: QuizItem; index: number; total: number }
  | { type: "checkpoint"; checkpoint: Checkpoint }