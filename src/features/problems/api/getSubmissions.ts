import { graphqlRequest } from "@/lib/graphql-client"

const SUBMISSION_LIST_QUERY = `
  query submissionList(
    $questionSlug: String!
    $limit: Int
    $offset: Int
  ) {
    submissionList: questionSubmissionList(
      questionSlug: $questionSlug
      limit: $limit
      offset: $offset
    ) {
      submissions {
        id
        langName
        memory
        runtime
        statusDisplay
        timestamp
      }
    }
  }
`

type SubmissionListResponse = {
  submissionList: {
    submissions: Array<{
      id: string
      langName: string
      memory: string
      runtime: string
      statusDisplay: string
      timestamp: string
    }>
  }
}

export type SubmissionHistoryItem = {
  id: string
  language: string
  memory: string
  runtime: string
  status: string
  timestamp: string
}

type GetSubmissionsOptions = {
  limit?: number
  offset?: number
}

export async function getSubmissions(
  questionSlug: string,
  { limit = 10, offset = 0 }: GetSubmissionsOptions = {},
): Promise<SubmissionHistoryItem[]> {
  const data = await graphqlRequest<SubmissionListResponse>({
    query: SUBMISSION_LIST_QUERY,
    variables: {
      limit,
      offset,
      questionSlug,
    },
  })

  return data.submissionList.submissions.map((submission) => ({
    id: submission.id,
    language: submission.langName,
    memory: submission.memory,
    runtime: submission.runtime,
    status: submission.statusDisplay,
    timestamp: submission.timestamp,
  }))
}
