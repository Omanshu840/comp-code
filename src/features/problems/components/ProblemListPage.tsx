import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
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
import { Input } from "@/components/ui/input"
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

import { getProblems, type ProblemStatus } from "../api/getProblems"

const DIFFICULTY_OPTIONS = ["All", "Easy", "Medium", "Hard"] as const
const PAGE_SIZE = 25

function getDifficultyVariant(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "success" as const
    case "medium":
      return "warning" as const
    case "hard":
      return "danger" as const
    default:
      return "outline" as const
  }
}

function getStatusVariant(status: ProblemStatus) {
  switch (status) {
    case "SOLVED":
      return "success" as const
    case "ATTEMPTED":
      return "warning" as const
    default:
      return "outline" as const
  }
}

function getStatusLabel(status: ProblemStatus) {
  switch (status) {
    case "SOLVED":
      return "Solved"
    case "ATTEMPTED":
      return "Attempted"
    default:
      return "Not tried"
  }
}

type ProblemListPageProps = {
  embedded?: boolean
}

export function ProblemListPage({ embedded = false }: ProblemListPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tagFilter, setTagFilter] = useState("")
  const [page, setPage] = useState(1)
  const [difficultyFilter, setDifficultyFilter] =
    useState<(typeof DIFFICULTY_OPTIONS)[number]>("All")
  const {
    data,
    error,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["problems", searchQuery, difficultyFilter, tagFilter, page],
    queryFn: () =>
      getProblems({
        difficulty: difficultyFilter === "All" ? undefined : difficultyFilter,
        limit: PAGE_SIZE,
        searchKeyword: searchQuery.trim(),
        skip: (page - 1) * PAGE_SIZE,
        tagQuery: tagFilter,
      }),
  })

  useEffect(() => {
    setPage(1)
  }, [difficultyFilter, searchQuery, tagFilter])

  const availableTags = useMemo(() => {
    if (!data?.items.length) {
      return []
    }

    return Array.from(
      new Set(data.items.flatMap((problem) => problem.tags.map((tag) => tag.name))),
    ).sort((left, right) => left.localeCompare(right))
  }, [data?.items])

  const problems = useMemo(() => {
    if (!data?.items) {
      return []
    }

    return data.items
  }, [data?.items])

  const pageCount = data ? Math.max(1, Math.ceil(data.totalLength / PAGE_SIZE)) : 1

  const content = (
    <Card className="border-border/80 bg-card/95 shadow-sm backdrop-blur">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Problem List</CardTitle>
          <CardDescription>
            Browse LeetCode problems with status, filters, and paginated results.
          </CardDescription>
        </div>
        <Button variant="outline" onClick={() => void refetch()}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
            <div className="mb-4 grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-3 md:grid-cols-[minmax(0,1fr)_220px_220px]">
              <div className="space-y-2">
                <Label
                  className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground"
                  htmlFor="problem-search"
                >
                  Search by title
                </Label>
                <Input
                  id="problem-search"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search problems like Two Sum"
                  value={searchQuery}
                />
              </div>

              <div className="space-y-2">
                <Label
                  className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground"
                  htmlFor="difficulty-filter"
                >
                  Difficulty
                </Label>
                <Select
                  onValueChange={(value) =>
                    setDifficultyFilter(
                      value as (typeof DIFFICULTY_OPTIONS)[number],
                    )
                  }
                  value={difficultyFilter}
                >
                  <SelectTrigger id="difficulty-filter" className="w-full" size="default">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground"
                  htmlFor="tag-filter"
                >
                  Tag filter
                </Label>
                <Input
                  id="tag-filter"
                  list="problem-tag-options"
                  onChange={(event) => setTagFilter(event.target.value)}
                  placeholder="Filter by tag like Array"
                  value={tagFilter}
                />
                <datalist id="problem-tag-options">
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag} />
                  ))}
                </datalist>
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 text-sm text-muted-foreground">
                Loading problems...
              </div>
            ) : null}

            {isError ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 text-center">
                <div className="space-y-1">
                  <p className="text-base font-semibold text-destructive">
                    Failed to load problems
                  </p>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    {error instanceof Error
                      ? error.message
                      : "Something went wrong while fetching the LeetCode problem list."}
                  </p>
                </div>
                <Button onClick={() => void refetch()}>Try again</Button>
              </div>
            ) : null}

            {!isLoading &&
            !isError &&
            data &&
            data.totalLength === 0 &&
            problems.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 text-sm text-muted-foreground">
                No problems found.
              </div>
            ) : null}

            {!isLoading &&
            !isError &&
            data &&
            data.totalLength > 0 &&
            problems.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
                <p className="text-base font-medium">No matching problems</p>
                <p className="text-sm text-muted-foreground">
                  Try a different title, difficulty, or tag filter.
                </p>
              </div>
            ) : null}

            {!isLoading && !isError && problems.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                  <span>
                    Showing {(page - 1) * PAGE_SIZE + 1}-
                    {Math.min(page * PAGE_SIZE, data?.totalLength ?? page * PAGE_SIZE)} of{" "}
                    {data?.totalLength ?? problems.length} problems
                  </span>
                  <span>
                    Solved in list: {data?.finishedLength ?? 0}
                    {isFetching && !isLoading ? " • Refreshing..." : ""}
                  </span>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {problems.map((problem) => (
                      <TableRow key={problem.titleSlug}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <Button asChild className="h-auto p-0 text-left" variant="link">
                              <Link to={`/problems/${problem.titleSlug}`}>
                                {problem.title}
                              </Link>
                            </Button>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>/problems/{problem.titleSlug}</span>
                              {problem.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag.slug} variant="secondary">
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDifficultyVariant(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(problem.status)}>
                            {getStatusLabel(problem.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {pageCount}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      disabled={page === 1 || isFetching}
                      onClick={() => setPage((currentPage) => currentPage - 1)}
                      type="button"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={!data?.hasMore || isFetching}
                      onClick={() => setPage((currentPage) => currentPage + 1)}
                      type="button"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
              ) : null}
      </CardContent>
    </Card>
  )

  if (embedded) {
    return content
  }

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.08),_transparent_34%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-muted)_48%,white),_var(--color-background)_48%)] px-4 py-5 sm:px-5 sm:py-6 lg:px-6 dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_30%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-card)_82%,black),_var(--color-background)_52%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <section className="space-y-2">
          <div className="inline-flex rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium tracking-[0.24em] uppercase text-muted-foreground backdrop-blur">
            Problem Browser
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Browse real LeetCode problems
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Problems are fetched through the shared GraphQL client and cached
              with React Query, with server-backed pagination and solve status.
            </p>
          </div>
        </section>

        {content}
      </div>
    </main>
  )
}
