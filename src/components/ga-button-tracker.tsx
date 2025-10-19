"use client"

import { useEffect } from "react"

function safeGtag(...args: unknown[]) {
  if (typeof window === "undefined") return
  // Type window.gtag as a function accepting unknown args to avoid explicit `any`.
  const w = window as Window & { gtag?: (...args: unknown[]) => void }
  const gtag = w.gtag
  if (typeof gtag === "function") {
    // Call with unknown[] spread - this is safe and avoids `any`.
    ;(gtag as (...a: unknown[]) => void)(...args)
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
