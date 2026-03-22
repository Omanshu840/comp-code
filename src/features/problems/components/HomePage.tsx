import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ProblemListPage } from "./ProblemListPage"
import { SolvedProblemsPanel } from "./SolvedProblemsPanel"

export function HomePage() {
  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.08),_transparent_34%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-muted)_48%,white),_var(--color-background)_48%)] px-4 py-5 sm:px-5 sm:py-6 lg:px-6 dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_30%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-card)_82%,black),_var(--color-background)_52%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="space-y-2">
          <div className="inline-flex rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium tracking-[0.24em] uppercase text-muted-foreground backdrop-blur">
            CompCode
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Practice, review, and revisit solved problems
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              Switch between your solved history and the full problem browser
              without leaving the home page.
            </p>
          </div>
        </section>

        <Tabs defaultValue="solved">
          <TabsList>
            <TabsTrigger value="solved">Solved</TabsTrigger>
            <TabsTrigger value="problem-list">Problem List</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-4" value="solved">
            <SolvedProblemsPanel />
          </TabsContent>

          <TabsContent className="mt-4" value="problem-list">
            <ProblemListPage embedded />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
