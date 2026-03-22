import { post } from "@/lib/api-client"

type SubmitCodeParams = {
  code: string
  language: string
  questionId: string
  slug: string
}

type SubmitCodeResponse = {
  submission_id?: number | string
}

export async function submitCode({
  code,
  language,
  questionId,
  slug,
}: SubmitCodeParams): Promise<string> {
  const response = await post<SubmitCodeResponse>(
    `/api/leetcode/problems/${slug}/submit/`,
    {
      body: {
        lang: language,
        question_id: questionId,
        typed_code: code,
      },
    },
  )

  if (response.submission_id === undefined || response.submission_id === null) {
    throw new Error("LeetCode did not return a submission id")
  }

  return String(response.submission_id)
}
