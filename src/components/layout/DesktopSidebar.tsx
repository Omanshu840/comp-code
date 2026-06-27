import { BookOpen, Code } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { PropsWithChildren } from "react"

function DesktopLink({
  href,
  children,
}: PropsWithChildren<{ href: string }>) {
  const { pathname } = useLocation()
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href)
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </Link>
  )
}

export function DesktopSidebar() {
  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r">
      <div className="flex flex-col gap-y-5 overflow-y-auto px-6 pt-5">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                <li>
                  <DesktopLink href="/">
                    <BookOpen className="size-5" />
                    Learn
                  </DesktopLink>
                </li>
                <li>
                  <DesktopLink href="/solve">
                    <Code className="size-5" />
                    Solve
                  </DesktopLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}
