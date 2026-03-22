import { get } from "@/lib/api-client"

type SubmissionStatusResponse = {
  compile_error?: string
  full_runtime_error?: string
  memory?: number | string
  runtime?: string
  state?: string
  status_code?: number
  status_msg?: string
}

export type SubmissionResult = {
  error: string | null
  memory: string | null
  runtime: string | null
  status: string
}

const SUBMISSION_POLL_INTERVAL_MS = 1200
const SUBMISSION_POLL_MAX_ATTEMPTS = 30

function sleep(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function isPendingSubmission(response: SubmissionStatusResponse) {
  const state = response.state?.toUpperCase()
  const status = response.status_msg?.toUpperCase()

  return state === "PENDING" || status === "PENDING"
}

function formatMemory(memory: number | string | undefined) {
  if (memory === undefined || memory === null || memory === "") {
    return null
  }

  return String(memory)
}

export async function pollSubmissionResult(
  submissionId: string,
): Promise<SubmissionResult> {
  for (let attempt = 0; attempt < SUBMISSION_POLL_MAX_ATTEMPTS; attempt += 1) {
    const response = await get<SubmissionStatusResponse>(
      `/api/leetcode/submissions/detail/${submissionId}/check/`,
    )

    if (!isPendingSubmission(response)) {
      return {
        error:
          response.compile_error ??
          response.full_runtime_error ??
          (response.status_code && response.status_code !== 10
            ? response.status_msg ?? "Submission failed"
            : null),
        memory: formatMemory(response.memory),
        runtime: response.runtime ?? null,
        status: response.status_msg ?? "Finished",
      }
    }

    await sleep(SUBMISSION_POLL_INTERVAL_MS)
  }

  throw new Error("Timed out while waiting for submission results")
}
