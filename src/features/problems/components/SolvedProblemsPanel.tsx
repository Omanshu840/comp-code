import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/store/auth-store"

import { getSolvedProblems } from "../api/getSolvedProblems"
import {
  getSubmissionDetails,
  type SubmissionDetails,
} from "../api/getSubmissionDetails"
import { getSubmissions } from "../api/getSubmissions"
import { updateSubmissionNote } from "../api/updateSubmissionNote"

function getSubmissionBadgeVariant(status: string) {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus.includes("accepted")) {
    return "success" as const
  }

  if (normalizedStatus.includes("wrong answer")) {
    return "warning" as const
  }

  if (
    normalizedStatus.includes("error") ||
    normalizedStatus.includes("failed") ||
    normalizedStatus.includes("runtime")
  ) {
    return "danger" as const
  }

  return "outline" as const
}

function formatTimestamp(timestamp: string) {
  const parsedTimestamp = Number(timestamp) * 1000

  if (Number.isNaN(parsedTimestamp) || parsedTimestamp === 0) {
    return timestamp
  }

  return new Date(parsedTimestamp).toLocaleString()
}

function buildNotesPrompt({
  problemTitle,
  problemSlug,
  submissionId,
  submission,
}: {
  problemTitle: string
  problemSlug: string
  submissionId: string
  submission: SubmissionDetails
}) {
  const contextSections = [
    `Problem: ${problemTitle}`,
    `Slug: ${problemSlug}`,
    `Submission ID: ${submissionId}`,
    `Language: ${submission.language}`,
    `Runtime: ${submission.runtime ?? "N/A"}`,
    `Memory: ${submission.memory ?? "N/A"}`,
    submission.totalCorrect !== null && submission.totalTestcases !== null
      ? `Passed Testcases: ${submission.totalCorrect}/${submission.totalTestcases}`
      : null,
    submission.lastTestcase
      ? `Failed Testcase:\n${submission.lastTestcase}`
      : null,
    submission.expectedOutput
      ? `Expected Output:\n${submission.expectedOutput}`
      : null,
    submission.codeOutput ? `Actual Output:\n${submission.codeOutput}` : null,
    submission.runtimeError
      ? `Runtime Error:\n${submission.runtimeError}`
      : null,
    submission.compileError
      ? `Compile Error:\n${submission.compileError}`
      : null,
    `Submitted Code:\n${submission.code || "No code returned."}`,
  ].filter(Boolean)

  return [
    "You are helping me write concise study notes for a LeetCode submission.",
    "Analyze the submission context and code below, then write notes in Markdown using exactly these section headings:",
    "1. Intuition",
    "2. Key Take away",
    "3. Things to remember",
    "4. Time Complexity",
    "5. Space Complexity",
    "Keep the notes practical, specific to this submission, and focused on interview preparation.",
    "",
    ...contextSections,
  ].join("\n\n")
}

export function SolvedProblemsPanel() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const username = typeof user?.username === "string" ? user.username : ""
  const [selectedProblemSlug, setSelectedProblemSlug] = useState<string | null>(
    null,
  )
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    null,
  )
  const [submissionNote, setSubmissionNote] = useState("")
  const [copyPromptStatus, setCopyPromptStatus] = useState<
    "idle" | "success" | "error"
  >("idle")

  const { data: solvedProblems, isLoading: isSolvedProblemsLoading } = useQuery({
    enabled: Boolean(username),
    queryKey: ["solved-problems", username],
    queryFn: () => getSolvedProblems(username),
  })
  const { data: submissions, isLoading: isSubmissionsLoading } = useQuery({
    enabled: Boolean(selectedProblemSlug),
    queryKey: ["solved-problem-submissions", selectedProblemSlug],
    queryFn: () => getSubmissions(selectedProblemSlug ?? ""),
  })
  const {
    data: selectedSubmission,
    isLoading: isSubmissionDetailsLoading,
  } = useQuery({
    enabled: Boolean(selectedSubmissionId),
    queryKey: ["solved-submission-details", selectedSubmissionId],
    queryFn: () => getSubmissionDetails(selectedSubmissionId ?? ""),
  })
  const saveNoteMutation = useMutation({
    mutationFn: ({
      submissionId,
      note,
    }: {
      submissionId: string
      note: string
    }) => updateSubmissionNote({ submissionId, note }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["solved-submission-details", variables.submissionId],
      })
    },
  })

  const selectedProblem = useMemo(() => {
    return solvedProblems?.find(
      (problem) => problem.titleSlug === selectedProblemSlug,
    )
  }, [selectedProblemSlug, solvedProblems])

  useEffect(() => {
    if (!solvedProblems?.length) {
      return
    }

    if (!selectedProblemSlug) {
      setSelectedProblemSlug(solvedProblems[0].titleSlug)
    }
  }, [selectedProblemSlug, solvedProblems])

  useEffect(() => {
    if (!submissions?.length) {
      setSelectedSubmissionId(null)
      return
    }

    setSelectedSubmissionId((currentId) => {
      if (currentId && submissions.some((submission) => submission.id === currentId)) {
        return currentId
      }

      return submissions[0].id
    })
  }, [submissions])

  useEffect(() => {
    if (!selectedSubmissionId) {
      setSubmissionNote("")
      return
    }

    setSubmissionNote(selectedSubmission?.notes ?? "")
  }, [selectedSubmission?.notes, selectedSubmissionId])

  useEffect(() => {
    setCopyPromptStatus("idle")
  }, [selectedSubmissionId])

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]">
      <Card className="border-border/80 bg-card/95 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle>Solved Problems</CardTitle>
          <CardDescription>
            Accepted problems from your recent solved history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSolvedProblemsLoading ? (
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-3 py-4 text-sm text-muted-foreground">
              Loading solved problems...
            </div>
          ) : null}

          {solvedProblems && solvedProblems.length > 0 ? (
            <div className="space-y-2">
              {solvedProblems.map((problem) => {
                const isSelected = problem.titleSlug === selectedProblemSlug

                return (
                  <button
                    key={problem.titleSlug}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? "border-primary/30 bg-primary/8"
                        : "border-border/70 bg-background/80 hover:bg-muted/40"
                    }`}
                    onClick={() => {
                      setSelectedProblemSlug(problem.titleSlug)
                    }}
                    type="button"
                  >
                    <p className="font-medium">{problem.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatTimestamp(problem.latestAcceptedAt)}
                    </p>
                  </button>
                )
              })}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/95 shadow-sm backdrop-blur">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>{selectedProblem?.title ?? "Solved details"}</CardTitle>
            <CardDescription>
              Submission history, submitted code, and personal notes.
            </CardDescription>
          </div>
          {selectedProblem ? (
            <Button asChild size="sm" variant="outline">
              <Link to={`/problems/${selectedProblem.titleSlug}`}>Open problem</Link>
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Submissions</p>
              {isSubmissionsLoading ? (
                <span className="text-xs text-muted-foreground">Loading...</span>
              ) : null}
            </div>
            <div className="mt-3">
              {submissions && submissions.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-border/70 bg-background/80">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Runtime</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow
                          key={submission.id}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedSubmissionId(submission.id)
                          }}
                        >
                          <TableCell>
                            <Badge variant={getSubmissionBadgeVariant(submission.status)}>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{submission.language}</TableCell>
                          <TableCell>{submission.runtime || "N/A"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatTimestamp(submission.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border/70 bg-background/60 px-3 py-4 text-xs text-muted-foreground">
                  No submissions found for this problem.
                </div>
              )}
            </div>
          </div>

          {selectedSubmissionId ? (
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Submission details</p>
                <span className="text-xs text-muted-foreground">
                  #{selectedSubmissionId}
                </span>
              </div>

              {isSubmissionDetailsLoading ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Loading submission details...
                </p>
              ) : null}

              {selectedSubmission ? (
                <div className="mt-3 space-y-3">
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>Language: {selectedSubmission.language}</span>
                    <span>Runtime: {selectedSubmission.runtime ?? "N/A"}</span>
                    <span>Memory: {selectedSubmission.memory ?? "N/A"}</span>
                  </div>

                  {selectedSubmission.totalCorrect !== null &&
                  selectedSubmission.totalTestcases !== null ? (
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>
                        Passed: {selectedSubmission.totalCorrect}/
                        {selectedSubmission.totalTestcases}
                      </span>
                    </div>
                  ) : null}

                  {selectedSubmission.compileError ? (
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-destructive">
                        Compile error
                      </p>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                        {selectedSubmission.compileError}
                      </pre>
                    </div>
                  ) : null}

                  {selectedSubmission.runtimeError ? (
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-destructive">
                        Runtime error
                      </p>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                        {selectedSubmission.runtimeError}
                      </pre>
                    </div>
                  ) : null}

                  {selectedSubmission.lastTestcase ? (
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                        Failed testcase
                      </p>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/70 bg-background/80 p-3 font-mono text-xs text-foreground">
                        {selectedSubmission.lastTestcase}
                      </pre>
                    </div>
                  ) : null}

                  {selectedSubmission.expectedOutput ? (
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                        Expected output
                      </p>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/70 bg-background/80 p-3 font-mono text-xs text-foreground">
                        {selectedSubmission.expectedOutput}
                      </pre>
                    </div>
                  ) : null}

                  {selectedSubmission.codeOutput ? (
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                        Your output
                      </p>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/70 bg-background/80 p-3 font-mono text-xs text-foreground">
                        {selectedSubmission.codeOutput}
                      </pre>
                    </div>
                  ) : null}

                  {selectedSubmission.stdOutput ? (
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                        Stdout
                      </p>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/70 bg-background/80 p-3 font-mono text-xs text-foreground">
                        {selectedSubmission.stdOutput}
                      </pre>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                      Submitted code
                    </p>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/70 bg-background/80 p-3 font-mono text-xs text-foreground">
                      {selectedSubmission.code || "No code returned."}
                    </pre>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Notes</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Save intuition, pitfalls, and learnings directly on the selected
                  LeetCode submission.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  disabled={!selectedSubmissionId || !selectedSubmission}
                  onClick={async () => {
                    if (
                      !selectedSubmissionId ||
                      !selectedSubmission ||
                      !selectedProblem
                    ) {
                      return
                    }

                    try {
                      await navigator.clipboard.writeText(
                        buildNotesPrompt({
                          problemTitle: selectedProblem.title,
                          problemSlug: selectedProblem.titleSlug,
                          submissionId: selectedSubmissionId,
                          submission: selectedSubmission,
                        }),
                      )
                      setCopyPromptStatus("success")
                    } catch {
                      setCopyPromptStatus("error")
                    }
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Copy prompt
                </Button>
                <Button
                  disabled={
                    !selectedSubmissionId ||
                    saveNoteMutation.isPending ||
                    submissionNote === (selectedSubmission?.notes ?? "")
                  }
                  onClick={() => {
                    if (!selectedSubmissionId) {
                      return
                    }

                    saveNoteMutation.mutate({
                      submissionId: selectedSubmissionId,
                      note: submissionNote,
                    })
                  }}
                  size="sm"
                  type="button"
                >
                  {saveNoteMutation.isPending ? "Saving..." : "Save note"}
                </Button>
              </div>
            </div>
            <Tabs className="mt-3" defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <div className="rounded-xl border border-border/70 bg-background/80 p-4">
                  {submissionNote.trim() ? (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {submissionNote}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No notes yet. Generate notes with AI or write your own, then
                      save them to this submission.
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="edit">
                <Textarea
                  className="min-h-56"
                  disabled={!selectedSubmissionId || saveNoteMutation.isPending}
                  onChange={(event) => setSubmissionNote(event.target.value)}
                  placeholder="Select a submission, then write your intuition, edge cases, complexity notes, or reminders here..."
                  value={submissionNote}
                />
              </TabsContent>
            </Tabs>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {selectedSubmissionId
                  ? `Attached to submission #${selectedSubmissionId}`
                  : "Choose a submission to edit its note."}
              </p>
            </div>
            {copyPromptStatus === "success" ? (
              <p className="mt-2 text-xs text-emerald-600">
                AI notes prompt copied to clipboard.
              </p>
            ) : null}
            {copyPromptStatus === "error" ? (
              <p className="mt-2 text-xs text-destructive">
                Failed to copy the prompt.
              </p>
            ) : null}
            {saveNoteMutation.isError ? (
              <p className="mt-2 text-xs text-destructive">
                {saveNoteMutation.error instanceof Error
                  ? saveNoteMutation.error.message
                  : "Failed to save note."}
              </p>
            ) : null}
            {saveNoteMutation.isSuccess ? (
              <p className="mt-2 text-xs text-emerald-600">
                Note saved to LeetCode.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
