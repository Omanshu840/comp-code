import { Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/app/AppLayout"
import { DashboardPage } from "@/features/dsa-learning/pages/DashboardPage"
import { LessonPage } from "@/features/dsa-learning/pages/LessonPage"
import { RevisionPage } from "@/features/dsa-learning/pages/RevisionPage"
import { RoadmapPage } from "@/features/dsa-learning/pages/RoadmapPage"
import { RoadmapProblemPage } from "@/features/dsa-learning/pages/RoadmapProblemPage"
import { LeetcodePage } from "@/features/leetcode/pages/LeetcodePage"
import { HomePage } from "@/features/problems/components/HomePage"
import { ProblemDetailPage } from "@/features/problems/components/ProblemDetailPage"

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<HomePage />} path="/" />
        <Route element={<ProblemDetailPage />} path="/problems/:slug" />
        <Route element={<DashboardPage />} path="/learn" />
        <Route element={<LeetcodePage />} path="/leetcode" />
        <Route element={<LessonPage />} path="/learn/:problemId/lesson" />
        <Route element={<RoadmapPage />} path="/learn/roadmap" />
        <Route element={<RoadmapProblemPage />} path="/learn/roadmap/:problemId" />
        <Route element={<RevisionPage />} path="/learn/:problemId/revision" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Route>
    </Routes>
  )
}

export default App
