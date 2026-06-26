import roadmapData from "../../../scrapper/structures/roadmap.json"
import systemDesignRoadmapData from "../../../scrapper/structures/system-design-roadmap.json"

type RoadmapProblem = {
  problem_id: string
  problem_name: string
  difficulty: string
  article?: string
  youtube?: string
  leetcode?: string
  plus?: string
  editorial?: string
  link?: string
}

type RoadmapSubcategory = {
  subcategory_id: string
  subcategory_name: string
  problems: RoadmapProblem[]
}

type RoadmapCategory = {
  category_id: string
  category_name: string
  subcategories: RoadmapSubcategory[]
}

export type ProblemExample = {
  input: string
  output: string
  explanation?: string
}

export type ProblemContent = {
  problem_statement: string
  examples: ProblemExample[]
}

export type Approach = {
  name: string
  intuition_and_algorithm: string
  images?: string[]
  complexities?: {
    time?: string
    space?: string
  }
  code?: Record<string, string>
}

export type DsaProblem = RoadmapProblem & {
  categoryId: string
  categoryName: string
  subcategoryId: string
  subcategoryName: string
  order: number
  pathKey: string
  problem?: ProblemContent
  approaches: Approach[]
}

export type DsaCategory = {
  id: string
  name: string
  subcategories: Array<{
    id: string
    name: string
    problems: DsaProblem[]
  }>
}

const problemModules = import.meta.glob<ProblemContent>(
  "../../../scrapper/content/**/problem.json",
  { eager: true, import: "default" },
)
const approachModules = import.meta.glob<Approach[]>(
  "../../../scrapper/content/**/approaches.json",
  { eager: true, import: "default" },
)

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function getFolderKey(path: string) {
  const parts = path.split("/")
  return normalizeKey(parts.at(-2) ?? path)
}

const problemContentByKey = new Map<string, ProblemContent>()
const approachesByKey = new Map<string, Approach[]>()

Object.entries(problemModules).forEach(([path, content]) => {
  problemContentByKey.set(getFolderKey(path), content)
})

Object.entries(approachModules).forEach(([path, approaches]) => {
  approachesByKey.set(getFolderKey(path), approaches)
})

export const dsaCategories: DsaCategory[] = (roadmapData as RoadmapCategory[]).map(
  (category) => ({
    id: category.category_id,
    name: category.category_name,
    subcategories: category.subcategories.map((subcategory) => ({
      id: subcategory.subcategory_id,
      name: subcategory.subcategory_name,
      problems: subcategory.problems.map((problem, index) => {
        const key = normalizeKey(problem.problem_name)

        return {
          ...problem,
          categoryId: category.category_id,
          categoryName: category.category_name,
          subcategoryId: subcategory.subcategory_id,
          subcategoryName: subcategory.subcategory_name,
          order: index,
          pathKey: key,
          problem: problemContentByKey.get(key),
          approaches: approachesByKey.get(key) ?? [],
        }
      }),
    })),
  }),
)

export const systemDesignCategories: DsaCategory[] = (systemDesignRoadmapData as RoadmapCategory[]).map(
  (category) => ({
    id: category.category_id,
    name: category.category_name,
    subcategories: category.subcategories.map((subcategory) => ({
      id: subcategory.subcategory_id,
      name: subcategory.subcategory_name,
      problems: subcategory.problems.map((problem, index) => {
        const key = normalizeKey(problem.problem_name)

        return {
          ...problem,
          categoryId: category.category_id,
          categoryName: category.category_name,
          subcategoryId: subcategory.subcategory_id,
          subcategoryName: subcategory.subcategory_name,
          order: index,
          pathKey: key,
          problem: problemContentByKey.get(key),
          approaches: approachesByKey.get(key) ?? [],
        }
      }),
    })),
  }),
)

export const dsaProblems = dsaCategories.flatMap((category) =>
  category.subcategories.flatMap((subcategory) => subcategory.problems),
)

export const systemDesignProblems = systemDesignCategories.flatMap((category) =>
  category.subcategories.flatMap((subcategory) => subcategory.problems),
)

const allProblems = [...dsaProblems, ...systemDesignProblems]

export function getProblemById(problemId: string | undefined) {
  if (!problemId) {
    return undefined
  }

  return allProblems.find((problem) => problem.problem_id === problemId)
}

export function hasLesson(problem: DsaProblem) {
  return Boolean(problem.problem && problem.approaches.length > 0)
}

export function getTrackPreview(limit?: number) {
  const problemsWithLessons = dsaProblems.filter((problem) => hasLesson(problem))
  if (limit) {
    return problemsWithLessons.slice(0, limit)
  }
  return problemsWithLessons
}

export function getSystemDesignTrackPreview(limit?: number) {
  const problemsWithLessons = systemDesignProblems.filter((problem) => hasLesson(problem))
  if (limit) {
    return problemsWithLessons.slice(0, limit)
  }
  return problemsWithLessons
}

export default function cleanScrapedText(value: string | undefined) {
  return (value ?? "")
    .replaceAll("Â", "")
    .replaceAll("â", "'")
    .replaceAll("â", "-")
    .replaceAll("â", "-")
    .replaceAll("â", '"')
    .replaceAll("â", '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
