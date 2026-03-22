type HttpMethod = "GET" | "POST"

const LEETCODE_SESSION_STORAGE_KEY = "leetcode_session"
const LEETCODE_CSRF_STORAGE_KEY = "leetcode_csrf"
const LEETCODE_PROXY_SESSION_HEADER = "x-leetcode-session"
const LEETCODE_PROXY_CSRF_HEADER = "x-leetcode-csrf"

type RequestOptions = Omit<RequestInit, "body" | "headers" | "method"> & {
  headers?: HeadersInit
}

type PostOptions = RequestOptions & {
  body?: unknown
}

type ApiClientConfig = {
  baseUrl?: string
  defaultHeaders?: HeadersInit
} & Pick<RequestInit, "credentials">

const defaultConfig: ApiClientConfig = {
  baseUrl: import.meta.env.DEV ? "" : (import.meta.env.VITE_API_BASE_URL ?? ""),
  credentials: "same-origin",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
}

function buildUrl(path: string, baseUrl: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  if (!baseUrl) {
    return path
  }

  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

  return `${normalizedBaseUrl}${path}`
}

function mergeHeaders(...headerSets: Array<HeadersInit | undefined>) {
  const headers = new Headers()

  for (const headerSet of headerSets) {
    if (!headerSet) {
      continue
    }

    new Headers(headerSet).forEach((value, key) => {
      headers.set(key, value)
    })
  }

  return headers
}

function getStoredValue(key: string) {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(key)
}

function getLeetCodeAuthHeaders(): HeadersInit | undefined {
  const session = getStoredValue(LEETCODE_SESSION_STORAGE_KEY)
  const csrfToken = getStoredValue(LEETCODE_CSRF_STORAGE_KEY)

  if (!session || !csrfToken) {
    return undefined
  }

  return {
    [LEETCODE_PROXY_SESSION_HEADER]: session,
    [LEETCODE_PROXY_CSRF_HEADER]: csrfToken,
  }
}

async function request<TResponse>(
  method: HttpMethod,
  path: string,
  options: RequestOptions & { body?: BodyInit } = {},
): Promise<TResponse> {
  const { headers, ...init } = options

  const response = await fetch(buildUrl(path, defaultConfig.baseUrl ?? ""), {
    ...init,
    method,
    credentials: init.credentials ?? defaultConfig.credentials,
    headers: mergeHeaders(
      defaultConfig.defaultHeaders,
      getLeetCodeAuthHeaders(),
      headers,
    ),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as TResponse
}

export function configureApiClient(config: ApiClientConfig) {
  defaultConfig.baseUrl = config.baseUrl ?? defaultConfig.baseUrl
  defaultConfig.credentials = config.credentials ?? defaultConfig.credentials
  defaultConfig.defaultHeaders = mergeHeaders(
    defaultConfig.defaultHeaders,
    config.defaultHeaders,
  )
}

export function setLeetCodeAuthTokens(session: string, csrfToken: string) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(LEETCODE_SESSION_STORAGE_KEY, session)
  window.localStorage.setItem(LEETCODE_CSRF_STORAGE_KEY, csrfToken)
}

export function clearLeetCodeAuthTokens() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(LEETCODE_SESSION_STORAGE_KEY)
  window.localStorage.removeItem(LEETCODE_CSRF_STORAGE_KEY)
}

export function get<TResponse>(
  path: string,
  options?: RequestOptions,
): Promise<TResponse> {
  return request<TResponse>("GET", path, options)
}

export function post<TResponse>(
  path: string,
  options: PostOptions = {},
): Promise<TResponse> {
  const { body, ...requestOptions } = options

  return request<TResponse>("POST", path, {
    ...requestOptions,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}
