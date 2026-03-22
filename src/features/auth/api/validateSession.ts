import { graphqlRequest } from "../../../lib/graphql-client"

const MATCHED_USER_QUERY = `
  query matchedUser($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
      }
    }
  }
`

type MatchedUser = {
  username: string
  profile: {
    realName: string
    userAvatar: string
    ranking: number
  } | null
}

type MatchedUserResponse = {
  matchedUser: MatchedUser | null
}

export async function validateSession(): Promise<MatchedUser> {
  const userStatusData = await graphqlRequest<{
    userStatus: {
      username: string | null
    } | null
  }>({
    query: `
      query authUserStatus {
        userStatus {
          username
        }
      }
    `,
  })

  const username = userStatusData.userStatus?.username

  if (!username) {
    throw new Error("Invalid LeetCode session")
  }

  const data = await graphqlRequest<MatchedUserResponse>({
    query: MATCHED_USER_QUERY,
    variables: {
      username,
    },
  })

  if (!data.matchedUser) {
    throw new Error("Invalid LeetCode session")
  }

  return data.matchedUser
}
