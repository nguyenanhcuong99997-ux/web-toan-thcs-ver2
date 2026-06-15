"use client"

import { useState } from "react"
import { Eye, Save, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MathTeX } from "@/components/math"
import { cn } from "@/lib/utils"

const SNIPPETS = ["\\frac{a}{b}", "\\sqrt{x}", "x^{2}", "\\sqrt{x^2 + y^2}", "\\frac{-b \\pm \\sqrt{\\Delta}}{2a}"]

export function LatexCreator() {
  const [grade, setGrade] = useState("9")
  const [topic, setTopic] = useState("Căn bậc hai")
  const [difficulty, setDifficulty] = useState("Thông hiểu")
  const [prompt, setPrompt] = useState("Rút gọn biểu thức sau:")
  const [latex, setLatex] = useState("\\sqrt{48} - \\sqrt{27} + \\sqrt{12}")
  const [options, setOptions] = useState({ A: "3\\sqrt{3}", B: "\\sqrt{3}", C: "5\\sqrt{3}", D: "2\\sqrt{3}" })
  const [correct, setCorrect] = useState<"A" | "B" | "C" | "D">("A")
  const [saved, setSaved] = useState(false)

  function updateOption(key: keyof typeof options, value: string) {
    setOptions((o) => ({ ...o, [key]: value }))
    setSaved(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Soạn đề bài bằng mã LaTeX</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Nhập công thức Toán học và xem trước trực quan ngay lập tức.
          </p>
        </div>
        <Button
          onClick={() => setSaved(true)}
          className={cn(saved && "bg-emerald-600 hover:bg-emerald-600")}
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Đã lưu câu hỏi" : "Lưu câu hỏi"}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Left: form */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Khối lớp</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["6", "7", "8", "9"].map((g) => (
                    <SelectItem key={g} value={g}>
                      Lớp {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Chủ đề</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Mức độ</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prompt">Nội dung câu hỏi</Label>
            <Input id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="latex">Mã LaTeX của đề bài</Label>
            <Textarea
              id="latex"
              value={latex}
              onChange={(e) => {
                setLatex(e.target.value)
                setSaved(false)
              }}
              rows={3}
              className="font-mono text-sm"
              placeholder="\\frac{a}{b}, \\sqrt{x^2 + y^2} = r"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SNIPPETS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setLatex((l) => `${l} ${s}`)}
                  className="rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(["A", "B", "C", "D"] as const).map((key) => (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`opt-${key}`}>Đáp án {key}</Label>
                  <button
                    type="button"
                    onClick={() => setCorrect(key)}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                      correct === key
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {correct === key ? "Đáp án đúng" : "Chọn đúng"}
                  </button>
                </div>
                <Input
                  id={`opt-${key}`}
                  value={options[key]}
                  onChange={(e) => updateOption(key, e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: live preview */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Xem trước trực quan</span>
              <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                Live
              </span>
            </div>
            <div className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Lớp {grade} · {topic}
                </span>
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {difficulty}
                </span>
              </div>
              <p className="text-base text-foreground">{prompt}</p>
              {latex.trim() && (
                <div className="mt-3 overflow-x-auto rounded-xl bg-muted/50 px-4 py-4 text-center text-xl">
                  <MathTeX latex={latex} display />
                </div>
              )}

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {(["A", "B", "C", "D"] as const).map((key) => (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-3 py-2.5",
                      correct === key ? "border-emerald-300 bg-emerald-50" : "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                        correct === key ? "bg-emerald-600 text-white" : "bg-muted text-foreground",
                      )}
                    >
                      {key}
                    </span>
                    <span className="text-foreground">
                      {options[key].trim() ? <MathTeX latex={options[key]} /> : <span className="text-muted-foreground">—</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-primary">Mẹo soạn thảo</p>
            <p className="mt-1 leading-relaxed">
              Sử dụng cú pháp LaTeX chuẩn: <code className="font-mono">{"\\frac{tử}{mẫu}"}</code> cho phân số,{" "}
              <code className="font-mono">{"\\sqrt{x}"}</code> cho căn bậc hai, và{" "}
              <code className="font-mono">{"x^{2}"}</code> cho lũy thừa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
