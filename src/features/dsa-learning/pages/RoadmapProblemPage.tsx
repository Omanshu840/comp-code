import { useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getProblemById } from "../content"
import { useCompletedProblems } from "../hooks/useCompletedProblems"

export function RoadmapProblemPage() {
  const { problemId } = useParams<{ problemId: string }>()
  const { markCompleted } = useCompletedProblems()
  const problem = getProblemById(problemId)

  if (!problem) {
    return <div>Problem not found</div>
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28 pt-5 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold">{problem.problem_name}</h3>
          <div className="mt-4 prose prose-sm dark:prose-invert">
            <ReactMarkdown>{problem.problem?.problem_statement}</ReactMarkdown>
          </div>
          <Button onClick={() => markCompleted(problem.problem_id)} className="mt-4">Mark as Read</Button>
        </CardContent>
      </Card>
    </div>
  )
}
