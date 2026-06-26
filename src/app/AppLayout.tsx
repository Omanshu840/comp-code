import { Outlet } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { ScrollToTop } from "@/components/layout/ScrollToTop"

export function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <AppShell>
        <Outlet />
      </AppShell>
    </>
  )
}
