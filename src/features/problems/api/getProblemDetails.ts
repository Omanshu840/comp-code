import { graphqlRequest } from "@/lib/graphql-client"

const QUESTION_DETAILS_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      content
      exampleTestcases
      codeSnippets {
        lang
        langSlug
        code
      }
    }
  }
`

type QuestionDetailsResponse = {
  question: {
    questionId: string | null
    title: string | null
    content: string | null
    exampleTestcases: string | null
    codeSnippets: Array<{
      lang: string
      langSlug: string
      code: string
    }>
  } | null
}

export type ProblemCodeSnippet = {
  code: string
  lang: string
  langSlug: string
}

export type ProblemDetails = {
  codeSnippets: ProblemCodeSnippet[]
  description: string
  examples: string
  questionId: string
  title: string
}

export async function getProblemDetails(
  titleSlug: string,
): Promise<ProblemDetails> {
  const data = await graphqlRequest<QuestionDetailsResponse>({
    query: QUESTION_DETAILS_QUERY,
    variables: {
      titleSlug,
    },
  })

  if (!data.question) {
    throw new Error("Problem not found")
  }

  return {
    description: data.question.content ?? "",
    examples: data.question.exampleTestcases ?? "",
    codeSnippets: data.question.codeSnippets ?? [],
    questionId: data.question.questionId ?? "",
    title: data.question.title ?? titleSlug,
  }
}
