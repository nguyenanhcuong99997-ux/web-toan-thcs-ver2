"use client"

import { useMemo } from "react"
import katex from "katex"
import { cn } from "@/lib/utils"

interface MathProps {
  latex: string
  display?: boolean
  className?: string
}

export function MathTeX({ latex, display = false, className }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        output: "html",
      })
    } catch {
      return latex
    }
  }, [latex, display])

  return (
    <span
      className={cn(display && "block py-1", className)}
      // KaTeX produces sanitized markup
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
