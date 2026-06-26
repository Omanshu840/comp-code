import { Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/app/AppLayout"
import { DashboardPage } from "@/features/dsa-learning/pages/DashboardPage"
import { LessonPage } from "@/features/dsa-learning/pages/LessonPage"
import { RevisionPage } from "@/features/dsa-learning/pages/RevisionPage"
import { HomePage } from "@/features/problems/components/HomePage"
import { ProblemDetailPage } from "@/features/problems/components/ProblemDetailPage"

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<DashboardPage />} path="/" />
        <Route element={<LessonPage />} path="/:problemId/lesson" />
        <Route element={<RevisionPage />} path="/:problemId/revision" />
        <Route element={<HomePage />} path="/solve" />
        <Route element={<ProblemDetailPage />} path="/solve/problems/:slug" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Route>
    </Routes>
  )
}

export default App
