"use client"

import { useEffect } from "react"

function safeGtag(...args: any[]) {
  if (typeof window === "undefined") return
  const gtag = (window as any).gtag
  if (typeof gtag === "function") {
    gtag(...args)
  }
}

export default function GAButtonTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return

      // Find nearest button element (delegation)
      const btn = target.closest("button") as HTMLButtonElement | null
      if (!btn) return

      // Extract a label for the button
      const label = btn.getAttribute("aria-label") || btn.innerText || btn.className || "unknown"

      // Send GA event
      safeGtag("event", "button_click", {
        event_category: "interaction",
        event_label: label.trim().slice(0, 200),
        non_interaction: false,
      })
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return null
}
