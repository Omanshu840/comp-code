import Editor from "@monaco-editor/react"
import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import DOMPurify from "dompurify"
import { Link, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { getProblemDetails } from "../api/getProblemDetails"
import { getSubmissionDetails } from "../api/getSubmissionDetails"
import { getSubmissions } from "../api/getSubmissions"
import { pollSubmissionResult } from "../api/pollSubmissionResult"
import { runCode } from "../api/runCode"
import { submitCode } from "../api/submitCode"

const SUPPORTED_LANGUAGES = [
  {
    editorLanguage: "javascript",
    label: "JavaScript",
    snippetSlug: "javascript",
    value: "javascript",
  },
  {
    editorLanguage: "python",
    label: "Python",
    snippetSlug: "python3",
    value: "python",
  },
  {
    editorLanguage: "cpp",
    label: "C++",
    snippetSlug: "cpp",
    value: "cpp",
  },
] as const

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

function buildExampleBlocks(examples: string) {
  const lines = examples
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return []
  }

  const blocks: string[][] = []

  for (let index = 0; index < lines.length; index += 2) {
    blocks.push(lines.slice(index, index + 2))
  }

  return blocks
}

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

function formatSubmissionTime(timestamp: string) {
  const parsedTimestamp = Number(timestamp) * 1000

  if (Number.isNaN(parsedTimestamp) || parsedTimestamp === 0) {
    return timestamp
  }

  return new Date(parsedTimestamp).toLocaleString()
}

export function ProblemDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage["value"]>("cpp")
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    null,
  )
  const [editorCode, setEditorCode] = useState("")
  const { data, error, isError, isLoading } = useQuery({
    enabled: Boolean(slug),
    queryKey: ["problem-details", slug],
    queryFn: () => getProblemDetails(slug ?? ""),
  })
  const { data: submissions, isLoading: isSubmissionsLoading } = useQuery({
    enabled: Boolean(slug),
    queryKey: ["submission-history", slug],
    queryFn: () => getSubmissions(slug ?? ""),
  })
  const {
    data: selectedSubmission,
    isLoading: isSubmissionDetailsLoading,
  } = useQuery({
    enabled: Boolean(selectedSubmissionId),
    queryKey: ["submission-details", selectedSubmissionId],
    queryFn: () => getSubmissionDetails(selectedSubmissionId ?? ""),
  })

  const sanitizedDescription = useMemo(() => {
    return DOMPurify.sanitize(data?.description ?? "")
  }, [data?.description])
  const runCodeMutation = useMutation({
    mutationFn: async () => {
      if (!data || !slug) {
        throw new Error("Problem details are not loaded yet")
      }

      return runCode({
        code: editorCode,
        input: data.examples,
        language: selectedLanguageConfig.snippetSlug,
        questionId: data.questionId,
        slug,
      })
    },
  })
  const submitCodeMutation = useMutation({
    mutationFn: async () => {
      if (!data || !slug) {
        throw new Error("Problem details are not loaded yet")
      }

      const submissionId = await submitCode({
        code: editorCode,
        language: selectedLanguageConfig.snippetSlug,
        questionId: data.questionId,
        slug,
      })

      return pollSubmissionResult(submissionId)
    },
  })

  const selectedLanguageConfig = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find(
        (language) => language.value === selectedLanguage,
      ) ?? SUPPORTED_LANGUAGES[0]
    )
  }, [selectedLanguage])

  const exampleBlocks = useMemo(() => {
    return buildExampleBlocks(data?.examples ?? "")
  }, [data?.examples])

  useEffect(() => {
    if (!data || !slug) {
      return
    }

    const matchingSnippet = data.codeSnippets.find(
      (snippet) => snippet.langSlug === selectedLanguageConfig.snippetSlug,
    )

    setEditorCode(matchingSnippet?.code ?? "")
  }, [data, selectedLanguageConfig.snippetSlug, slug])

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.08),_transparent_34%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-muted)_48%,white),_var(--color-background)_48%)] px-3 py-4 sm:px-4 sm:py-5 lg:px-6 dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_30%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-card)_82%,black),_var(--color-background)_52%)]">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link to="/">Back to problems</Link>
          </Button>
          <div className="text-xs text-muted-foreground sm:text-sm">
            {slug ? (
              <span className="font-mono">{slug}</span>
            ) : (
              "No problem selected"
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)]">
            <Card className="min-h-[78svh]" />
            <Card className="min-h-[78svh]" />
          </div>
        ) : null}

        {isError ? (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">
                Failed to load problem
              </CardTitle>
              <CardDescription>
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while fetching problem details."}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {!isLoading && !isError && data ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,1.04fr)]">
            <Card className="border-border/80 bg-card/95">
              <CardHeader className="p-4 pb-3">
                <CardTitle>{data.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <article
                  className="prose prose-neutral max-w-none text-sm dark:prose-invert [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_code]:rounded [&_code]:bg-muted/80 [&_code]:px-1 [&_code]:py-0.5"
                  dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                />
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/95">
              <CardHeader className="p-4 pb-3">
                <CardTitle>Workspace</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Tabs defaultValue="code">
                  <TabsList>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                  </TabsList>

                  <TabsContent className="mt-3 space-y-3" value="code">
                    <div className="flex items-end justify-between gap-3">
                      <div className="space-y-2">
                        <Label
                          className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground"
                          htmlFor="editor-language"
                        >
                          Language
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setSelectedLanguage(value as SupportedLanguage["value"])
                          }
                          value={selectedLanguage}
                        >
                          <SelectTrigger id="editor-language" className="w-full" size="default">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {SUPPORTED_LANGUAGES.map((language) => (
                              <SelectItem key={language.value} value={language.value}>
                                {language.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          disabled={runCodeMutation.isPending || !data.questionId}
                          onClick={() => {
                            runCodeMutation.reset()
                            void runCodeMutation.mutateAsync()
                          }}
                          variant="outline"
                        >
                          {runCodeMutation.isPending ? "Running..." : "Run code"}
                        </Button>
                        <Button
                          disabled={submitCodeMutation.isPending || !data.questionId}
                          onClick={() => {
                            submitCodeMutation.reset()
                            void submitCodeMutation.mutateAsync()
                          }}
                        >
                          {submitCodeMutation.isPending ? "Submitting..." : "Submit code"}
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/80">
                      <Editor
                        defaultLanguage="cpp"
                        height="68svh"
                        language={selectedLanguageConfig.editorLanguage}
                        onChange={(value) => setEditorCode(value ?? "")}
                        options={{
                          automaticLayout: true,
                          fontSize: 14,
                          minimap: { enabled: false },
                          padding: { top: 16 },
                          scrollBeyondLastLine: false,
                        }}
                        theme="vs-dark"
                        value={editorCode}
                      />
                    </div>

                    {runCodeMutation.isError ? (
                      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-3">
                        <p className="text-sm font-medium text-destructive">
                          Run failed
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                          {runCodeMutation.error instanceof Error
                            ? runCodeMutation.error.message
                            : "Something went wrong while running the code."}
                        </p>
                      </div>
                    ) : null}

                    {runCodeMutation.data ? (
                      <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-medium">Run result</p>
                          <span className="text-xs text-muted-foreground">
                            {runCodeMutation.data.status}
                          </span>
                          {runCodeMutation.data.runtime ? (
                            <span className="text-xs text-muted-foreground">
                              Runtime: {runCodeMutation.data.runtime}
                            </span>
                          ) : null}
                        </div>
                        {runCodeMutation.data.error ? (
                          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                            {runCodeMutation.data.error}
                          </pre>
                        ) : null}
                        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/70 bg-background/80 p-3 text-xs text-muted-foreground">
                          {runCodeMutation.data.output || "No output returned."}
                        </pre>
                      </div>
                    ) : null}

                    {submitCodeMutation.isError ? (
                      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-3">
                        <p className="text-sm font-medium text-destructive">
                          Submission failed
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                          {submitCodeMutation.error instanceof Error
                            ? submitCodeMutation.error.message
                            : "Something went wrong while submitting the code."}
                        </p>
                      </div>
                    ) : null}

                    {submitCodeMutation.data ? (
                      <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-medium">Submission result</p>
                          <Badge
                            variant={getSubmissionBadgeVariant(
                              submitCodeMutation.data.status,
                            )}
                          >
                            {submitCodeMutation.data.status}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>
                            Runtime: {submitCodeMutation.data.runtime ?? "N/A"}
                          </span>
                          <span>
                            Memory: {submitCodeMutation.data.memory ?? "N/A"}
                          </span>
                        </div>
                        {submitCodeMutation.data.error ? (
                          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                            {submitCodeMutation.data.error}
                          </pre>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
                      <p className="text-sm font-medium">Examples</p>
                      {exampleBlocks.length > 0 ? (
                        <Tabs className="mt-3" defaultValue="case-1">
                          <TabsList>
                            {exampleBlocks.map((_, index) => (
                              <TabsTrigger
                                key={`tab-${index + 1}`}
                                value={`case-${index + 1}`}
                              >
                                Case {index + 1}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          {exampleBlocks.map((block, index) => (
                            <TabsContent
                              key={`panel-${index + 1}`}
                              value={`case-${index + 1}`}
                            >
                              <div className="rounded-xl border border-border/70 bg-background/80 p-3">
                                <div className="space-y-2">
                                  {block.map((value, valueIndex) => (
                                    <div
                                      key={`${value}-${valueIndex}`}
                                      className="rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs text-foreground"
                                    >
                                      {value}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      ) : (
                        <div className="mt-2 rounded-xl border border-dashed border-border/70 bg-background/60 px-3 py-4 text-xs text-muted-foreground">
                          No example payload returned.
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent className="mt-3" value="submissions">
                    <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">Past submissions</p>
                        {isSubmissionsLoading ? (
                          <span className="text-xs text-muted-foreground">
                            Loading...
                          </span>
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
                                      <Badge
                                        variant={getSubmissionBadgeVariant(
                                          submission.status,
                                        )}
                                      >
                                        {submission.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{submission.language}</TableCell>
                                    <TableCell>
                                      {submission.runtime || "N/A"}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                      {formatSubmissionTime(submission.timestamp)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-border/70 bg-background/60 px-3 py-4 text-xs text-muted-foreground">
                            No past submissions found.
                          </div>
                        )}
                      </div>

                      {selectedSubmissionId ? (
                        <div className="mt-4 rounded-xl border border-border/70 bg-background/80 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium">
                              Submission details
                            </p>
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
                                <span>
                                  Language: {selectedSubmission.language}
                                </span>
                                <span>
                                  Runtime: {selectedSubmission.runtime ?? "N/A"}
                                </span>
                                <span>
                                  Memory: {selectedSubmission.memory ?? "N/A"}
                                </span>
                              </div>

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
                                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/70 bg-muted/40 p-3 font-mono text-xs text-foreground">
                                    {selectedSubmission.lastTestcase}
                                  </pre>
                                </div>
                              ) : null}

                              <div>
                                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                                  Submitted code
                                </p>
                                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/70 bg-muted/40 p-3 font-mono text-xs text-foreground">
                                  {selectedSubmission.code || "No code returned."}
                                </pre>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  )
}
