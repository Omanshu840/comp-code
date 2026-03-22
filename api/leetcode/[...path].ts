const LEETCODE_BASE_URL = "https://leetcode.com"
const LEETCODE_PROXY_PREFIX = "/api/leetcode"
const LEETCODE_PROXY_SESSION_HEADER = "x-leetcode-session"
const LEETCODE_PROXY_CSRF_HEADER = "x-leetcode-csrf"

function buildCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": [
      "content-type",
      LEETCODE_PROXY_SESSION_HEADER,
      LEETCODE_PROXY_CSRF_HEADER,
    ].join(", "),
    Vary: "Origin",
  }
}

export const config = {
  runtime: "edge",
}

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = buildCorsHeaders(request.headers.get("origin"))

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  const requestUrl = new URL(request.url)
  const targetPath = requestUrl.pathname.slice(LEETCODE_PROXY_PREFIX.length) || "/"
  const targetUrl = new URL(targetPath, LEETCODE_BASE_URL)
  targetUrl.search = requestUrl.search

  const proxyHeaders = new Headers()
  const session = request.headers.get(LEETCODE_PROXY_SESSION_HEADER)
  const csrfToken = request.headers.get(LEETCODE_PROXY_CSRF_HEADER)

  request.headers.forEach((value, key) => {
    if (
      key === "host" ||
      key === "origin" ||
      key === "referer" ||
      key === "content-length" ||
      key === LEETCODE_PROXY_SESSION_HEADER ||
      key === LEETCODE_PROXY_CSRF_HEADER
    ) {
      return
    }

    proxyHeaders.set(key, value)
  })

  proxyHeaders.set("origin", LEETCODE_BASE_URL)
  proxyHeaders.set("referer", targetUrl.toString())

  if (session && csrfToken) {
    proxyHeaders.set(
      "cookie",
      `LEETCODE_SESSION=${session}; csrftoken=${csrfToken}`,
    )
    proxyHeaders.set("x-csrftoken", csrfToken)
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: proxyHeaders,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
    })

    const responseHeaders = new Headers(response.headers)

    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value)
    })

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to proxy LeetCode request",
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    )
  }
}
