import {
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, HashRouter } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider.tsx"
import { queryClient } from "@/lib/query-client.ts"
import App from "./App.tsx"
import "./index.css"

const Router = import.meta.env.VITE_USE_HASH_ROUTER === "true"
  ? HashRouter
  : BrowserRouter

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Router>
      {import.meta.env.DEV ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  </StrictMode>
)
