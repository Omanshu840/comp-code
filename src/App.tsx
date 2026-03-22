import { Navigate, Route, Routes } from "react-router-dom"

import { AuthGuard } from "@/features/auth/components/AuthGuard"
import { HomePage } from "@/features/problems/components/HomePage"
import { ProblemDetailPage } from "@/features/problems/components/ProblemDetailPage"

export function App() {
  return (
    <AuthGuard mode="redirect">
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<ProblemDetailPage />} path="/problems/:slug" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AuthGuard>
  )
}

export default App
