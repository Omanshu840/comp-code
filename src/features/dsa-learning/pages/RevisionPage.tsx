import {
  BookOpen,
  ChevronLeft,
  Code2,
  ExternalLink,
  Video,
} from "lucide-react"
import { Link, Navigate, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import cleanScrapedText, {
  getProblemById,
} from "../content"
import { difficultyVariant } from "../utils"
import { CodeBlock } from "../components/CodeBlock"
import { ImageCarousel } from "../components/ImageCarousel"
export function RevisionPage() {
  const { problemId } = useParams()
  const problem = getProblemById(problemId)

  if (!problem) {
    return <Navigate replace to="/" />
  }

  const anchors = [
    ["problem", "Problem"],
    problem.problem ? ["examples", "Examples"] : null,
    ...problem.approaches.map((approach, index) => [`approach-${index}`, approach.name]),
  ].filter(Boolean) as Array<[string, string]>

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-28 pt-5 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-10 lg:pb-12">
      <aside className="top-6 hidden self-start lg:sticky lg:block">
        <Button asChild className="mb-4" variant="outline">
          <Link to="/">
            <ChevronLeft className="size-4" />
            Path
          </Link>
        </Button>
        <nav className="space-y-1 border-l border-border pl-3">
          {anchors.map(([id, label]) => (
            <a className="block py-1 text-sm text-muted-foreground hover:text-foreground" href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <article className="min-w-0">
        <section className="border-b border-border pb-6" id="problem">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant={difficultyVariant(problem.difficulty)}>{problem.difficulty}</Badge>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {problem.categoryName}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-normal">{problem.problem_name}</h1>
          <p className="mt-5 text-sm leading-8 text-muted-foreground">
            {cleanScrapedText(problem.problem?.problem_statement)}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {problem.article ? (
              <a
                href={problem.article}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <ExternalLink className="size-4" />
                Article
              </a>
            ) : null}
            {problem.youtube ? (
              <a
                href={problem.youtube}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <Video className="size-4" />
                Video
              </a>
            ) : null}
            {problem.leetcode && problem.leetcode !== "$undefined" ? (
              <a
                href={problem.leetcode}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <BookOpen className="size-4" />
                LeetCode
              </a>
            ) : null}
          </div>
        </section>

        <section className="scroll-mt-6 border-b border-border py-8" id="examples">
          <h2 className="text-2xl font-semibold">Examples</h2>
          <div className="mt-4 grid gap-3">
            {(problem.problem?.examples ?? []).map((example, index) => (
              <div className="border border-border p-4" key={`${example.input}-${index}`}>
                <div className="text-sm font-semibold">Example {index + 1}</div>
                <pre className="mt-3 whitespace-pre-wrap break-words bg-muted p-3 font-mono text-xs">
{`Input: ${example.input}
Output: ${example.output}${example.explanation ? `
${example.explanation}` : ""}`}
                </pre>
              </div>
            ))}
          </div>
        </section>

        {problem.approaches.map((approach, index) => (
          <section className="scroll-mt-6 border-b border-border py-8" id={`approach-${index}`} key={approach.name}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Code2 className="size-4" />
              Approach {index + 1}
            </div>
            <h2 className="mt-3 text-xl font-semibold">{approach.name}</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground">
              {cleanScrapedText(approach.intuition_and_algorithm)}
            </p>
            {approach.images?.length ? <ImageCarousel images={approach.images} /> : null}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="border border-border p-4">
                <div className="text-sm font-semibold">Time</div>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                  {cleanScrapedText(approach.complexities?.time)}
                </p>
              </div>
              <div className="border border-border p-4">
                <div className="text-sm font-semibold">Space</div>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                  {cleanScrapedText(approach.complexities?.space)}
                </p>
              </div>
            </div>
            <CodeBlock approach={approach} />
          </section>
        ))}
      </article>
    </div>
  )
}
