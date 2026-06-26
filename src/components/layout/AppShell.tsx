import { BookOpen, Code } from "lucide-react"
import type { ReactNode, PropsWithChildren } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { DesktopSidebar } from "./DesktopSidebar"

function MobileLink({
  href,
  children,
}: PropsWithChildren<{ href:string }>) {
  const { pathname } = useLocation()
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href)
  return (
    <Link
      to={href}
      className={cn(
        "flex flex-col items-center gap-1 text-xs font-medium",
        isActive ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
    </Link>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const hideNav = pathname.includes("/lesson") || pathname.includes("/revision")

  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.08),_transparent_34%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-muted)_48%,white),_var(--color-background)_48%)] text-foreground dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_30%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-card)_82%,black),_var(--color-background)_52%)]">
      <DesktopSidebar />
      <main className={cn("md:pl-64", !hideNav && "pb-20 md:pb-0")}>{children}</main>

      {!hideNav && (
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-border bg-background/95 px-4 py-6 backdrop-blur md:hidden">
          <MobileLink href="/">
            <BookOpen className="size-5" />
          </MobileLink>
          <MobileLink href="/solve">
            <Code className="size-5" />
          </MobileLink>
        </nav>
      )}
    </div>
  )
}
