import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Clipboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Approach } from "../content"

export function CodeBlock({ approach }: { approach: Approach }) {
  const languages = Object.keys(approach.code ?? {})
  const [language, setLanguage] = useState(languages.includes("cpp") ? "cpp" : languages[0] ?? "cpp")
  const code = approach.code?.[language] ?? ""
  const [copied, setCopied] = useState(false)

  if (!code) {
    return null
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="mt-5 border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border p-2">
        <div className="flex gap-1 overflow-x-auto">
          {languages.map((item) => (
            <button
              className={cn(
                "px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                item === language ? "bg-foreground text-background" : "text-muted-foreground",
              )}
              key={item}
              type="button"
              onClick={() => setLanguage(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <Button aria-label="Copy code" size="icon-sm" variant="outline" onClick={copyCode}>
          {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
        </Button>
      </div>
      <pre className="max-h-[520px] overflow-auto bg-zinc-950 p-4 font-mono text-xs leading-5 text-zinc-50">
        <code>{code}</code>
      </pre>
    </div>
  )
}
