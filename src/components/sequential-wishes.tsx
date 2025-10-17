"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

export default function SequentialWishes({
  lines,
  className,
  intervalMs = 1600,
  autoStart = false,
}: {
  lines: string[]
  className?: string
  intervalMs?: number
  autoStart?: boolean
}) {
  const [index, setIndex] = useState(autoStart ? 0 : -1)

  useEffect(() => {
    if (!autoStart) return
    setIndex(0)
  }, [autoStart])

  useEffect(() => {
    if (index < 0) return
    if (index >= lines.length - 1) return
    const t = setTimeout(() => setIndex((i) => i + 1), intervalMs)
    return () => clearTimeout(t)
  }, [index, lines.length, intervalMs])

  const visibleLines = useMemo(() => lines.slice(0, Math.max(0, index + 1)), [lines, index])

  return (
    <div className={cn("mx-auto text-center", className)}>
      <div className="space-y-3">
        {visibleLines.map((l, i) => (
          <p
            key={i}
            className={cn(
              "text-(--wish-fg) text-base md:text-lg leading-relaxed",
              "opacity-0 animate-in fade-in slide-in-from-bottom-1 duration-700 fill-mode-forwards",
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {l}
          </p>
        ))}
      </div>
    </div>
  )
}
