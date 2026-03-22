import { graphqlRequest } from "@/lib/graphql-client"

const RECENT_AC_SUBMISSIONS_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`

type RecentAcSubmissionsResponse = {
  recentAcSubmissionList: Array<{
    id: string
    timestamp: string
    title: string
    titleSlug: string
  }>
}

export type SolvedProblemListItem = {
  latestAcceptedAt: string
  title: string
  titleSlug: string
}

export async function getSolvedProblems(
  username: string,
  limit = 100,
): Promise<SolvedProblemListItem[]> {
  const data = await graphqlRequest<RecentAcSubmissionsResponse>({
    query: RECENT_AC_SUBMISSIONS_QUERY,
    variables: {
      limit,
      username,
    },
  })

  const dedupedProblems = new Map<string, SolvedProblemListItem>()

  for (const submission of data.recentAcSubmissionList) {
    if (dedupedProblems.has(submission.titleSlug)) {
      continue
    }

    dedupedProblems.set(submission.titleSlug, {
      latestAcceptedAt: submission.timestamp,
      title: submission.title,
      titleSlug: submission.titleSlug,
    })
  }

  return Array.from(dedupedProblems.values())
}
