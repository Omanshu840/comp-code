import { get, post } from "@/lib/api-client"

type RunCodeParams = {
  code: string
  input: string
  language: string
  questionId: string
  slug: string
}

type RunCodeResponse = {
  interpret_id?: string
}

type RunStatusResponse = {
  code_answer?: string | string[]
  compile_error?: string
  expected_code_answer?: string | string[]
  expected_output?: string
  full_runtime_error?: string
  last_testcase?: string
  memory?: number
  pretty_lang?: string
  run_success?: boolean
  runtime?: string
  state?: string
  status_code?: number
  status_msg?: string
  std_output?: string
  task_finish_time?: number
  total_correct?: number
  total_testcases?: number
}

export type RunCodeResult = {
  error: string | null
  output: string
  runtime: string | null
  status: string
}

const RUN_POLL_INTERVAL_MS = 1200
const RUN_POLL_MAX_ATTEMPTS = 20

function sleep(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function formatValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.join("\n")
  }

  return value ?? ""
}

function isPendingStatus(response: RunStatusResponse) {
  const pendingStates = new Set(["PENDING", "STARTED", "SUCCESS"])
  const status = response.state?.toUpperCase()

  if (!status) {
    return false
  }

  return pendingStates.has(status) && response.run_success === undefined
}

async function pollRunStatus(interpretId: string) {
  for (let attempt = 0; attempt < RUN_POLL_MAX_ATTEMPTS; attempt += 1) {
    const response = await get<RunStatusResponse>(
      `/api/leetcode/submissions/detail/${interpretId}/check/`,
    )

    if (!isPendingStatus(response)) {
      return response
    }

    await sleep(RUN_POLL_INTERVAL_MS)
  }

  throw new Error("Timed out while waiting for run results")
}

export async function runCode({
  code,
  input,
  language,
  questionId,
  slug,
}: RunCodeParams): Promise<RunCodeResult> {
  const runResponse = await post<RunCodeResponse>(
    `/api/leetcode/problems/${slug}/interpret_solution/`,
    {
      body: {
        data_input: input,
        lang: language,
        question_id: questionId,
        typed_code: code,
      },
    },
  )

  if (!runResponse.interpret_id) {
    throw new Error("LeetCode did not return an interpret id")
  }

  const result = await pollRunStatus(runResponse.interpret_id)

  return {
    error:
      result.compile_error ??
      result.full_runtime_error ??
      (result.run_success === false ? result.status_msg ?? "Run failed" : null),
    output:
      result.std_output ||
      formatValue(result.code_answer) ||
      result.expected_output ||
      "",
    runtime: result.runtime ?? null,
    status: result.status_msg ?? (result.run_success ? "Accepted" : "Finished"),
  }
}
