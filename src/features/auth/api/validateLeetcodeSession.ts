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

type MatchedLeetcodeUser = {
  username: string
  profile: {
    realName: string
    userAvatar: string
    ranking: number
  } | null
}

type MatchedLeetcodeUserResponse = {
  matchedUser: MatchedLeetcodeUser | null
}

export async function validateLeetcodeSession(): Promise<MatchedLeetcodeUser> {
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

  const data = await graphqlRequest<MatchedLeetcodeUserResponse>({
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
