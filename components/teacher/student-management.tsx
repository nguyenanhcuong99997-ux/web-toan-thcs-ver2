"use client"

import { useMemo, useState } from "react"
import { Search, Eye, CalendarDays, Clock, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { STUDENTS } from "@/lib/mock-data"
import type { Student } from "@/lib/types"

function scoreColor(score: number) {
  if (score >= 8) return "text-emerald-600"
  if (score >= 6.5) return "text-primary"
  return "text-destructive"
}

export function StudentManagement() {
  const [query, setQuery] = useState("")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [selected, setSelected] = useState<Student | null>(null)

  const filtered = useMemo(() => {
    return STUDENTS.filter((s) => {
      const matchQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase())
      const matchGrade = gradeFilter === "all" || String(s.gradeId) === gradeFilter
      return matchQuery && matchGrade
    })
  }, [query, gradeFilter])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý Học viên</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tìm kiếm, lọc và theo dõi toàn bộ học viên trong các lớp.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Lọc theo lớp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả khối lớp</SelectItem>
            <SelectItem value="6">Lớp 6</SelectItem>
            <SelectItem value="7">Lớp 7</SelectItem>
            <SelectItem value="8">Lớp 8</SelectItem>
            <SelectItem value="9">Lớp 9</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Họ và tên</th>
                <th className="px-4 py-3 font-semibold">Lớp</th>
                <th className="px-4 py-3 font-semibold">Số bài đã làm</th>
                <th className="px-4 py-3 font-semibold">Điểm TB</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-right font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {s.name.split(" ").slice(-1)[0][0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      Lớp {s.gradeId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{s.testsTaken}</td>
                  <td className={cn("px-4 py-3 font-semibold", scoreColor(s.avgScore))}>
                    {s.avgScore.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        s.active ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", s.active ? "bg-emerald-500" : "bg-muted-foreground")} />
                      {s.active ? "Đang hoạt động" : "Ngoại tuyến"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelected(s)}>
                      <Eye className="h-4 w-4" />
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Không tìm thấy học viên phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentDetailDialog student={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function StudentDetailDialog({ student, onClose }: { student: Student | null; onClose: () => void }) {
  return (
    <Dialog open={!!student} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {student && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                  {student.name.split(" ").slice(-1)[0][0]}
                </div>
                <div>
                  <DialogTitle>{student.name}</DialogTitle>
                  <DialogDescription>
                    Lớp {student.gradeId} · {student.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Số bài đã làm", value: student.testsTaken },
                { label: "Điểm trung bình", value: student.avgScore.toFixed(1) },
                { label: "Hoạt động", value: student.lastActive },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Weak topics */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Mức độ thành thạo theo chủ đề</h4>
              <div className="space-y-3">
                {student.mastery.map((m) => {
                  const label = m.percent >= 80 ? "Tốt" : m.percent >= 60 ? "Khá" : "Cần cải thiện"
                  const tone =
                    m.percent >= 80 ? "bg-emerald-500" : m.percent >= 60 ? "bg-primary" : "bg-amber-500"
                  return (
                    <div key={m.topic}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{m.topic}</span>
                        <span className="text-muted-foreground">
                          {m.percent}% — {label}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", tone)} style={{ width: `${m.percent}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* History */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Lịch sử bài làm gần đây
              </h4>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-semibold">Tên bài làm</th>
                      <th className="px-3 py-2 font-semibold">Khối</th>
                      <th className="px-3 py-2 font-semibold">Đúng</th>
                      <th className="px-3 py-2 font-semibold">Điểm</th>
                      <th className="px-3 py-2 font-semibold">Thời gian</th>
                      <th className="px-3 py-2 font-semibold">Ngày nộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.submissions.map((sub) => (
                      <tr key={sub.id} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 font-medium text-foreground">{sub.title}</td>
                        <td className="px-3 py-2 text-muted-foreground">Lớp {sub.gradeId}</td>
                        <td className="px-3 py-2 text-foreground">
                          {sub.correct}/{sub.total}
                        </td>
                        <td className={cn("px-3 py-2 font-semibold", scoreColor(sub.score))}>
                          {sub.score.toFixed(1)}
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {sub.duration}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {sub.date}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
