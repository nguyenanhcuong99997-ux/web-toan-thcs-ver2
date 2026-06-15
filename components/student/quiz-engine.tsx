"use client"

import { useEffect, useMemo, useState } from "react"
import { Clock, ChevronLeft, ChevronRight, Send, X, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MathTeX } from "@/components/math"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/types"

type AnswerKey = "A" | "B" | "C" | "D"

interface QuizEngineProps {
  title: string
  questions: Question[]
  durationSeconds?: number
  onSubmit: (answers: Record<string, AnswerKey>) => void
  onExit: () => void
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

export function QuizEngine({ title, questions, durationSeconds = 900, onSubmit, onExit }: QuizEngineProps) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({})
  const [remaining, setRemaining] = useState(durationSeconds)

  useEffect(() => {
    if (remaining <= 0) {
      onSubmit(answers)
      return
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  const q = questions[current]
  const answeredCount = Object.keys(answers).length
  const lowTime = remaining <= 60

  const select = (key: AnswerKey) => setAnswers((a) => ({ ...a, [q.id]: key }))

  const progressPct = useMemo(
    () => Math.round((answeredCount / questions.length) * 100),
    [answeredCount, questions.length],
  )

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={onExit} aria-label="Thoát">
              <X className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">
                Đã trả lời {answeredCount}/{questions.length} câu
              </p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold tabular-nums",
              lowTime ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary",
            )}
            aria-live="polite"
          >
            <Clock className="h-4 w-4" />
            {formatTime(remaining)}
          </div>
        </div>
        <div className="h-1 w-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_280px]">
        {/* Question card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              Câu {current + 1}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {q.difficulty}
            </span>
          </div>

          <div className="space-y-3 text-lg text-foreground">
            <p className="leading-relaxed">{q.prompt}</p>
            {q.promptLatex && (
              <div className="rounded-xl bg-muted/60 px-4 py-3 text-center text-xl">
                <MathTeX latex={q.promptLatex} display />
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3">
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => select(opt.key)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                  >
                    {opt.key}
                  </span>
                  <span className="text-base text-foreground">
                    {opt.latex ? <MathTeX latex={opt.latex} /> : opt.text}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Câu trước
            </Button>
            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
                Câu tiếp theo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => onSubmit(answers)} className="bg-primary">
                <Send className="h-4 w-4" />
                Nộp bài
              </Button>
            )}
          </div>
        </div>

        {/* Navigation grid */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Flag className="h-4 w-4 text-primary" />
            Danh sách câu hỏi
          </div>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((qq, i) => {
              const done = answers[qq.id] !== undefined
              const isCurrent = i === current
              return (
                <button
                  key={qq.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                    isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-card"
                      : done
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground hover:bg-muted/70",
                  )}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
          <div className="space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-primary" /> Câu hiện tại
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-primary/15" /> Đã trả lời
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-muted" /> Chưa trả lời
            </div>
          </div>
          <Button onClick={() => onSubmit(answers)} className="w-full" size="lg">
            <Send className="h-4 w-4" />
            Nộp bài
          </Button>
        </aside>
      </div>
    </div>
  )
}
