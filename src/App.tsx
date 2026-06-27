import { Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/app/AppLayout"
import { DashboardPage } from "@/features/dsa-learning/pages/DashboardPage"
import { LessonPage } from "@/features/dsa-learning/pages/LessonPage"
import { RevisionPage } from "@/features/dsa-learning/pages/RevisionPage"
import { HomePage } from "@/features/problems/components/HomePage"
import { ProblemDetailPage } from "@/features/problems/components/ProblemDetailPage"
import { ProfilePage } from "@/features/profile/pages/ProfilePage"
import Login from "./features/auth/components/Login"
import { useAuth } from "./features/auth/hooks/useAuth"
import { ProtectedRoute } from "./app/ProtectedRoute"

function AppRoutes() {
  const { session } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<DashboardPage />} path="/" />
            <Route element={<LessonPage />} path="/:problemId/lesson" />
            <Route element={<RevisionPage />} path="/:problemId/revision" />
            <Route element={<HomePage />} path="/solve" />
            <Route
              element={<ProblemDetailPage />}
              path="/solve/problems/:slug"
            />
            <Route element={<ProfilePage />} path="/profile" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export function App() {
  return <AppRoutes />
}

export default App
