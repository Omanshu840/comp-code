import { graphqlRequest } from "@/lib/graphql-client"

const SUBMISSION_DETAILS_QUERY = `
  query submissionDetails($submissionId: Int!) {
    submissionDetails(submissionId: $submissionId) {
      code
      codeOutput
      compileError
      expectedOutput
      fullCodeOutput
      lastTestcase
      memory
      memoryDisplay
      notes
      runtime
      runtimeDisplay
      runtimeError
      statusCode
      timestamp
      totalCorrect
      totalTestcases
      stdOutput
      testBodies
      testDescriptions
      testInfo
      lang {
        name
        verboseName
      }
      question {
        questionId
        titleSlug
        hasFrontendPreview
      }
    }
  }
`

type SubmissionDetailsResponse = {
  submissionDetails: {
    code: string | null
    codeOutput: string | null
    compileError: string | null
    expectedOutput: string | null
    fullCodeOutput: string | null
    lastTestcase: string | null
    memory: number | null
    memoryDisplay: string | null
    notes: string | null
    runtime: string | null
    runtimeDisplay: string | null
    runtimeError: string | null
    statusCode: number | null
    timestamp: string | null
    totalCorrect: number | null
    totalTestcases: number | null
    stdOutput: string | null
    testBodies: string[] | null
    testDescriptions: string[] | null
    testInfo: string | null
    lang: {
      name: string | null
      verboseName: string | null
    } | null
    question: {
      questionId: string | null
      titleSlug: string | null
      hasFrontendPreview: boolean | null
    } | null
  } | null
}

export type SubmissionDetails = {
  code: string
  codeOutput: string | null
  compileError: string | null
  expectedOutput: string | null
  fullCodeOutput: string | null
  language: string
  lastTestcase: string | null
  memory: string | null
  notes: string | null
  questionId: string | null
  questionSlug: string | null
  runtime: string | null
  runtimeError: string | null
  statusCode: number | null
  stdOutput: string | null
  testBodies: string[]
  testDescriptions: string[]
  testInfo: string | null
  timestamp: string | null
  totalCorrect: number | null
  totalTestcases: number | null
}

export async function getSubmissionDetails(
  submissionId: string,
): Promise<SubmissionDetails> {
  const parsedId = Number(submissionId)

  if (Number.isNaN(parsedId)) {
    throw new Error("Invalid submission id")
  }

  const data = await graphqlRequest<SubmissionDetailsResponse>({
    query: SUBMISSION_DETAILS_QUERY,
    variables: {
      submissionId: parsedId,
    },
  })

  if (!data.submissionDetails) {
    throw new Error("Submission details not found")
  }

  return {
    code: data.submissionDetails.code ?? "",
    codeOutput: data.submissionDetails.codeOutput,
    compileError: data.submissionDetails.compileError,
    expectedOutput: data.submissionDetails.expectedOutput,
    fullCodeOutput: data.submissionDetails.fullCodeOutput,
    language:
      data.submissionDetails.lang?.verboseName ??
      data.submissionDetails.lang?.name ??
      "Unknown",
    lastTestcase: data.submissionDetails.lastTestcase,
    memory:
      data.submissionDetails.memoryDisplay ??
      (data.submissionDetails.memory !== null
        ? String(data.submissionDetails.memory)
        : null),
    notes: data.submissionDetails.notes,
    questionId: data.submissionDetails.question?.questionId ?? null,
    questionSlug: data.submissionDetails.question?.titleSlug ?? null,
    runtime:
      data.submissionDetails.runtimeDisplay ?? data.submissionDetails.runtime,
    runtimeError: data.submissionDetails.runtimeError,
    statusCode: data.submissionDetails.statusCode,
    stdOutput: data.submissionDetails.stdOutput,
    testBodies: data.submissionDetails.testBodies ?? [],
    testDescriptions: data.submissionDetails.testDescriptions ?? [],
    testInfo: data.submissionDetails.testInfo,
    timestamp: data.submissionDetails.timestamp,
    totalCorrect: data.submissionDetails.totalCorrect,
    totalTestcases: data.submissionDetails.totalTestcases,
  }
}
