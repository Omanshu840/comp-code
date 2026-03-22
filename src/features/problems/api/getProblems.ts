import { graphqlRequest } from "@/lib/graphql-client"

const QUESTION_LIST_QUERY = `
  query problemsetQuestionListV2(
    $filters: QuestionFilterInput
    $limit: Int
    $searchKeyword: String
    $skip: Int
    $sortBy: QuestionSortByInput
    $categorySlug: String
  ) {
    problemsetQuestionListV2(
      filters: $filters
      limit: $limit
      searchKeyword: $searchKeyword
      skip: $skip
      sortBy: $sortBy
      categorySlug: $categorySlug
    ) {
      questions {
        id
        title
        titleSlug
        difficulty
        status
        topicTags {
          name
          slug
        }
      }
      totalLength
      finishedLength
      hasMore
    }
  }
`

type QuestionListResponse = {
  problemsetQuestionListV2: {
    questions: Array<{
      id: string | number
      title: string
      titleSlug: string
      difficulty: string
      status: string | null
      topicTags: Array<{
        name: string
        slug: string
      }>
    }>
    totalLength: number
    finishedLength: number
    hasMore: boolean
  }
}

export type ProblemStatus = "SOLVED" | "ATTEMPTED" | "TO_DO"

export type ProblemListItem = {
  id: string
  title: string
  titleSlug: string
  difficulty: string
  status: ProblemStatus
  tags: Array<{
    name: string
    slug: string
  }>
}

export type ProblemListResult = {
  items: ProblemListItem[]
  totalLength: number
  finishedLength: number
  hasMore: boolean
}

type GetProblemsOptions = {
  categorySlug?: string
  difficulty?: string
  limit?: number
  searchKeyword?: string
  skip?: number
  tagQuery?: string
}

function normalizeProblemStatus(status: string | null): ProblemStatus {
  if (status === "SOLVED" || status === "ATTEMPTED") {
    return status
  }

  return "TO_DO"
}

export async function getProblems({
  categorySlug = "all-code-essentials",
  difficulty,
  limit = 25,
  searchKeyword = "",
  skip = 0,
  tagQuery = "",
}: GetProblemsOptions = {}): Promise<ProblemListResult> {
  const normalizedDifficulty = difficulty?.trim().toUpperCase()
  const normalizedTagQuery = tagQuery.trim().toLowerCase()

  const data = await graphqlRequest<QuestionListResponse>({
    query: QUESTION_LIST_QUERY,
    variables: {
      categorySlug,
      filters: {
        filterCombineType: "ALL",
        statusFilter: {
          questionStatuses: [],
          operator: "IS",
        },
        difficultyFilter: {
          difficulties: normalizedDifficulty ? [normalizedDifficulty] : [],
          operator: "IS",
        },
        languageFilter: {
          languageSlugs: [],
          operator: "IS",
        },
        topicFilter: {
          topicSlugs: [],
          operator: "IS",
        },
        acceptanceFilter: {},
        frequencyFilter: {},
        frontendIdFilter: {},
        lastSubmittedFilter: {},
        publishedFilter: {},
        companyFilter: {
          companySlugs: [],
          operator: "IS",
        },
        positionFilter: {
          positionSlugs: [],
          operator: "IS",
        },
        positionLevelFilter: {
          positionLevelSlugs: [],
          operator: "IS",
        },
        contestPointFilter: {
          contestPoints: [],
          operator: "IS",
        },
        premiumFilter: {
          premiumStatus: [],
          operator: "IS",
        },
      },
      limit,
      searchKeyword,
      skip,
      sortBy: {
        sortField: "CUSTOM",
        sortOrder: "ASCENDING",
      },
    },
  })

  const items = data.problemsetQuestionListV2.questions
    .map((question) => ({
      id: String(question.id),
      title: question.title,
      titleSlug: question.titleSlug,
      difficulty: question.difficulty,
      status: normalizeProblemStatus(question.status),
      tags: question.topicTags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      })),
    }))
    .filter((question) => {
      if (!normalizedTagQuery) {
        return true
      }

      return question.tags.some((tag) => {
        const normalizedTagName = tag.name.toLowerCase()
        const normalizedTagSlug = tag.slug.toLowerCase()

        return (
          normalizedTagName.includes(normalizedTagQuery) ||
          normalizedTagSlug.includes(normalizedTagQuery)
        )
      })
    })

  return {
    items,
    totalLength: data.problemsetQuestionListV2.totalLength,
    finishedLength: data.problemsetQuestionListV2.finishedLength,
    hasMore: data.problemsetQuestionListV2.hasMore,
  }
}
