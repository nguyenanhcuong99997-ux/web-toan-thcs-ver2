"use client"

import { CheckCircle2, XCircle, Trophy, RotateCcw, Home, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MathTeX } from "@/components/math"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/types"

type AnswerKey = "A" | "B" | "C" | "D"

interface QuizResultsProps {
  title: string
  questions: Question[]
  answers: Record<string, AnswerKey>
  onRetry: () => void
  onHome: () => void
}

export function QuizResults({ title, questions, answers, onRetry, onHome }: QuizResultsProps) {
  const correctCount = questions.filter((q) => answers[q.id] === q.correct).length
  const total = questions.length
  const score = Math.round((correctCount / total) * 100) / 10
  const percent = Math.round((correctCount / total) * 100)

  const feedback =
    percent >= 80
      ? { text: "Xuất sắc! Em đã nắm rất vững kiến thức.", tone: "text-emerald-600" }
      : percent >= 50
        ? { text: "Khá tốt! Hãy ôn lại các câu sai để tiến bộ hơn.", tone: "text-amber-600" }
        : { text: "Cần cố gắng thêm. Xem kỹ lời giải chi tiết nhé.", tone: "text-destructive" }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        {/* Score summary */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="bg-sidebar px-6 py-8 text-center text-sidebar-foreground">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Trophy className="h-7 w-7" />
            </div>
            <p className="text-sm text-sidebar-foreground/70">{title}</p>
            <p className="mt-2 text-5xl font-bold">
              {correctCount}/{total}
            </p>
            <p className={cn("mt-2 text-sm font-medium", "text-sidebar-foreground/90")}>{feedback.text}</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="px-4 py-5 text-center">
              <p className="text-2xl font-bold text-foreground">{score.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Điểm số</p>
            </div>
            <div className="px-4 py-5 text-center">
              <p className="text-2xl font-bold text-emerald-600">{correctCount}</p>
              <p className="text-xs text-muted-foreground">Câu đúng</p>
            </div>
            <div className="px-4 py-5 text-center">
              <p className="text-2xl font-bold text-destructive">{total - correctCount}</p>
              <p className="text-xs text-muted-foreground">Câu sai</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onRetry} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4" />
            Làm lại
          </Button>
          <Button onClick={onHome} className="flex-1">
            <Home className="h-4 w-4" />
            Về trang chủ
          </Button>
        </div>

        {/* Review */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            Xem lại bài làm & Lời giải chi tiết
          </h3>

          {questions.map((q, i) => {
            const userAnswer = answers[q.id]
            const isCorrect = userAnswer === q.correct
            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-2xl border-2 bg-card p-5 shadow-sm",
                  isCorrect ? "border-emerald-200" : "border-red-200",
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">Câu {i + 1}</span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Đúng
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                        <XCircle className="h-3.5 w-3.5" /> Sai
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-foreground">{q.prompt}</p>
                {q.promptLatex && (
                  <div className="mt-2 text-center text-lg">
                    <MathTeX latex={q.promptLatex} display />
                  </div>
                )}

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt) => {
                    const isCorrectOpt = opt.key === q.correct
                    const isUserOpt = opt.key === userAnswer
                    return (
                      <div
                        key={opt.key}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm",
                          isCorrectOpt
                            ? "border-emerald-300 bg-emerald-50"
                            : isUserOpt
                              ? "border-red-300 bg-red-50"
                              : "border-border bg-card",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                            isCorrectOpt
                              ? "bg-emerald-600 text-white"
                              : isUserOpt
                                ? "bg-red-500 text-white"
                                : "bg-muted text-foreground",
                          )}
                        >
                          {opt.key}
                        </span>
                        <span className="text-foreground">
                          {opt.latex ? <MathTeX latex={opt.latex} /> : opt.text}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Detailed solution */}
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="mb-2 text-sm font-semibold text-primary">Lời giải chi tiết</p>
                  <p className="text-sm leading-relaxed text-foreground">{q.solution}</p>
                  {q.solutionLatex && (
                    <div className="mt-2 overflow-x-auto rounded-lg bg-card px-4 py-3 text-center">
                      <MathTeX latex={q.solutionLatex} display />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
