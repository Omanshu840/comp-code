import { post } from "./api-client"

const LEETCODE_GRAPHQL_URL = "/api/leetcode/graphql"

type GraphQLVariables = Record<string, unknown>

type GraphQLError = {
  message: string
}

type GraphQLResponse<TData> = {
  data?: TData
  errors?: GraphQLError[]
}

type GraphQLRequest = {
  query: string
  variables?: GraphQLVariables
}

export class GraphQLClientError extends Error {
  readonly errors: GraphQLError[]

  constructor(message: string, errors: GraphQLError[] = []) {
    super(message)
    this.name = "GraphQLClientError"
    this.errors = errors
  }
}

export async function graphqlRequest<TData>({
  query,
  variables = {},
}: GraphQLRequest): Promise<TData> {
  let response: GraphQLResponse<TData>

  try {
    response = await post<GraphQLResponse<TData>>(LEETCODE_GRAPHQL_URL, {
      body: {
        query,
        variables,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLClientError(`GraphQL request failed: ${error.message}`)
    }

    throw new GraphQLClientError("GraphQL request failed")
  }

  if (response.errors?.length) {
    const message = response.errors.map((error) => error.message).join("; ")
    throw new GraphQLClientError(message, response.errors)
  }

  if (response.data === undefined) {
    throw new GraphQLClientError("GraphQL response did not include data")
  }

  return response.data
}
