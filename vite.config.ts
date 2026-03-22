import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const LEETCODE_PROXY_PREFIX = "/api/leetcode"
const LEETCODE_BASE_URL = "https://leetcode.com"

async function readRequestBody(request: NodeJS.ReadableStream) {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  if (chunks.length === 0) {
    return undefined
  }

  return Buffer.concat(chunks)
}

function createLeetCodeProxyPlugin(): Plugin {
  return {
    name: "leetcode-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith(LEETCODE_PROXY_PREFIX)) {
          next()
          return
        }

        const targetPath = req.url.slice(LEETCODE_PROXY_PREFIX.length) || "/"
        const targetUrl = new URL(targetPath, LEETCODE_BASE_URL)
        const requestHeaders = new Headers()
        const session = req.headers["x-leetcode-session"]
        const csrfToken = req.headers["x-leetcode-csrf"]

        Object.entries(req.headers).forEach(([key, value]) => {
          if (!value) {
            return
          }

          if (
            key === "host" ||
            key === "origin" ||
            key === "referer" ||
            key === "content-length" ||
            key === "x-leetcode-session" ||
            key === "x-leetcode-csrf"
          ) {
            return
          }

          if (Array.isArray(value)) {
            value.forEach((item) => requestHeaders.append(key, item))
            return
          }

          requestHeaders.set(key, value)
        })

        requestHeaders.set("origin", LEETCODE_BASE_URL)
        requestHeaders.set("referer", targetUrl.toString())

        if (typeof session === "string" && typeof csrfToken === "string") {
          requestHeaders.set(
            "cookie",
            `LEETCODE_SESSION=${session}; csrftoken=${csrfToken}`,
          )
          requestHeaders.set("x-csrftoken", csrfToken)
        }

        try {
          const response = await fetch(targetUrl, {
            method: req.method,
            headers: requestHeaders,
            body:
              req.method === "GET" || req.method === "HEAD"
                ? undefined
                : await readRequestBody(req),
          })

          res.statusCode = response.status

          response.headers.forEach((value, key) => {
            if (key === "content-encoding" || key === "transfer-encoding") {
              return
            }

            res.setHeader(key, value)
          })

          const responseBuffer = Buffer.from(await response.arrayBuffer())
          res.end(responseBuffer)
        } catch (error) {
          res.statusCode = 502
          res.setHeader("Content-Type", "application/json")
          res.end(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to proxy LeetCode request",
            }),
          )
        }
      })
    },
  }
}

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/comp-code/" : "/",
  plugins: [react(), tailwindcss(), createLeetCodeProxyPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
