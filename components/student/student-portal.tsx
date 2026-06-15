"use client"

import { useState } from "react"
import {
  Home,
  LayoutGrid,
  TrendingUp,
  Sigma,
  LogOut,
  CheckCircle2,
  Target,
  Clock,
  ChevronRight,
  ArrowLeft,
  Play,
  Award,
  Lock,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { GRADES, QUESTIONS, BADGES, STUDENT_PROGRESS } from "@/lib/mock-data"
import type { Grade, GradeId, Topic } from "@/lib/types"
import { QuizEngine } from "./quiz-engine"
import { QuizResults } from "./quiz-results"

// Mở rộng View để hỗ trợ kho tài liệu PDF
type View = "home" | "grades" | "analytics" | "pdfs"
type AnswerKey = "A" | "B" | "C" | "D"

interface StudentPortalProps {
  userName: string
  onLogout: () => void
}

// Bổ sung mục "Kho tài liệu PDF" vào Menu điều hướng
const NAV = [
  { id: "home" as View, label: "Trang chủ", icon: Home },
  { id: "grades" as View, label: "Khối lớp & Chủ đề", icon: LayoutGrid },
  { id: "pdfs" as View, label: "Kho tài liệu PDF", icon: FileText },
  { id: "analytics" as View, label: "Tiến độ cá nhân", icon: TrendingUp },
]

// Mock dữ liệu điểm danh của học sinh hiện tại
const MOCK_ATTENDANCE = [
  { date: "2026-06-15", status: "Present", label: "Có mặt" },
  { date: "2026-06-12", status: "Present", label: "Có mặt" },
  { date: "2026-06-10", status: "Absent_Excused", label: "Vắng có phép" },
  { date: "2026-06-08", status: "Present", label: "Có mặt" },
]

// Cập nhật Mock dữ liệu chứa đường link Google Drive đồng bộ với cổng Giáo viên
const MOCK_DOWNLOADABLE_PDFS = [
  { 
    id: "PDF001", 
    title: "Đề thi thử Vào Lớp 10 chung Toàn Tỉnh - Đề số 1", 
    grade: "9", 
    category: "Thi thử vào 10", 
    uploadDate: "2026-06-12", 
    fileSize: "Drive Link",
    driveUrl: "https://drive.google.com/file/d/1Xxxxxx_Mã_File_Mẫu_1/view?usp=sharing"
  },
  { 
    id: "PDF002", 
    title: "Đề cương Tổng ôn tập Kiến thức trọng tâm Toán 8 học kỳ 2", 
    grade: "8", 
    category: "Tài liệu học tập", 
    uploadDate: "2026-06-14", 
    fileSize: "Drive Link",
    driveUrl: "https://drive.google.com/file/d/1Xxxxxx_Mã_File_Mẫu_2/view?usp=sharing"
  },
  { 
    id: "PDF003", 
    title: "Chuyên đề Nâng cao: Bất đẳng thức và Cực trị Hình học", 
    grade: "9", 
    category: "Tài liệu học tập", 
    uploadDate: "2026-06-15", 
    fileSize: "Drive Link",
    driveUrl: "https://drive.google.com/file/d/1Xxxxxx_Mã_File_Mẫu_3/view?usp=sharing"
  },
]

export function StudentPortal({ userName, onLogout }: StudentPortalProps) {
  const [view, setView] = useState<View>("home")
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)
  const [quiz, setQuiz] = useState<{ title: string; topic?: Topic } | null>(null)
  const [results, setResults] = useState<{ title: string; answers: Record<string, AnswerKey> } | null>(null)

  const questions = QUESTIONS.slice(0, 15)

  function startQuiz(title: string, topic?: Topic) {
    setResults(null)
    setQuiz({ title, topic })
  }

  // Hàm chuyển đổi linh hoạt link Google Drive xem thông thường sang link tải trực tiếp (.pdf)
  const getDownloadUrl = (url: string) => {
    try {
      if (!url.includes("drive.google.com")) return url;
      // Trích xuất mã ID nằm giữa chuỗi /d/ và /view
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
      return url;
    } catch {
      return url;
    }
  }

  if (quiz) {
    return (
      <QuizEngine
        title={quiz.title}
        questions={questions}
        durationSeconds={900}
        onExit={() => setQuiz(null)}
        onSubmit={(answers) => {
          setResults({ title: quiz.title, answers })
          setQuiz(null)
        }}
      />
    )
  }

  if (results) {
    return (
      <QuizResults
        title={results.title}
        questions={questions}
        answers={results.answers}
        onRetry={() => startQuiz(results.title)}
        onHome={() => {
          setResults(null)
          setView("home")
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <div className="mb-8 flex items-center gap-3 px-2 pt-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sigma className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">TrueMath THCS</p>
            <p className="text-xs text-sidebar-foreground/60">Cổng học sinh</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id)
                setSelectedGrade(null)
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                view === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        {/* Mobile top nav */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <Sigma className="h-5 w-5 text-primary" />
            <span className="font-semibold">TrueMath</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Đăng xuất">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 md:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id)
                setSelectedGrade(null)
              }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                view === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
          {view === "home" && <HomeView userName={userName} onPractice={() => setView("grades")} onStart={startQuiz} />}
          {view === "grades" && (
            <GradesView
              selectedGrade={selectedGrade}
              onSelectGrade={setSelectedGrade}
              onStart={startQuiz}
            />
          )}
          {view === "analytics" && <AnalyticsView />}

          {/* VIEW DANH SÁCH FILE ĐỀ THI PDF ĐÃ ĐƯỢC KẾT NỐI VỚI GOOGLE DRIVE */}
          {view === "pdfs" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Kho tài liệu &amp; Đề thi PDF</h1>
                <p className="mt-1 text-sm text-muted-foreground">Xem trực tiếp hoặc tải về hệ thống bài tập tự luận nâng cao do thầy cô phát hành.</p>
              </div>

              <div className="grid gap-4">
                {MOCK_DOWNLOADABLE_PDFS.map((pdf) => (
                  <div key={pdf.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30">
                    <div className="flex gap-4 items-center min-w-0 flex-1">
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {pdf.category}
                        </span>
                        <h3 className="text-base font-bold text-foreground leading-tight truncate">{pdf.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs">
                          <span>Dành cho: Khối {pdf.grade}</span>
                          <span>•</span>
                          <span>Nguồn: Google Drive</span>
                          <span>•</span>
                          <span>Ngày đăng: {pdf.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                      {/* Nút 1: Xem trực tiếp tài liệu trên tab mới của trình duyệt */}
                      <a 
                        href={pdf.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60 text-center"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" /> Xem trực tiếp
                      </a>

                      {/* Nút 2: Tải trực tiếp file về máy tính/điện thoại */}
                      <a 
                        href={getDownloadUrl(pdf.driveUrl)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 text-center"
                      >
                        <Download className="h-4 w-4" /> Tải về máy (.pdf)
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function HomeView({
  userName,
  onPractice,
  onStart,
}: {
  userName: string
  onPractice: () => void
  onStart: (title: string) => void
}) {
  const presentCount = MOCK_ATTENDANCE.filter(a => a.status === "Present").length
  const attendanceRate = Math.round((presentCount / MOCK_ATTENDANCE.length) * 100)

  const stats = [
    { label: "Bài tập đã hoàn thành", value: "42", icon: CheckCircle2, tint: "text-emerald-600 bg-emerald-50" },
    { label: "Điểm trung bình", value: "8.6", icon: Target, tint: "text-primary bg-primary/10" },
    { label: "Tỷ lệ chuyên cần", value: `${attendanceRate}%`, icon: Calendar, tint: "text-amber-600 bg-amber-50" },
    { label: "Giờ luyện tập", value: "31h", icon: Clock, tint: "text-sky-600 bg-sky-50" },
  ]
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-sidebar p-6 text-sidebar-foreground sm:p-8">
        <p className="text-sm text-sidebar-foreground/70">Chào mừng quay trở lại,</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{userName}!</h1>
        <p className="mt-2 max-w-lg text-pretty text-sm leading-relaxed text-sidebar-foreground/70">
          Hôm nay là một ngày tuyệt vời để chinh phục những bài Toán mới. Hãy tiếp tục giữ vững phong độ nhé!
        </p>
        <Button onClick={onPractice} className="mt-5" size="lg">
          <Play className="h-4 w-4" />
          Bắt đầu luyện tập
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", s.tint)}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Đề thi gợi ý */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Đề thi gợi ý cho bạn</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: "Đề ôn tập Căn bậc hai số 4", meta: "Lớp 9 · 15 câu · 15 phút" },
              { title: "Kiểm tra Hàm số bậc nhất", meta: "Lớp 9 · 15 câu · 15 phút" },
              { title: "Đề tổng hợp Hình học HK2", meta: "Lớp 9 · 15 câu · 20 phút" },
            ].map((d) => (
              <button
                key={d.title}
                onClick={() => onStart(d.title)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div>
                  <p className="font-medium text-foreground">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.meta}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* BẢNG THEO DÕI ĐIỂM DANH CÁ NHÂN */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Lịch sử chuyên cần
            </h2>
            <div className="space-y-3">
              {MOCK_ATTENDANCE.map((record, index) => (
                <div key={index} className="flex items-center justify-between text-sm border-b border-border/60 pb-2 last:border-0 last:pb-0">
                  <span className="text-muted-foreground font-medium">{record.date}</span>
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                    record.status === "Present" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  )}>
                    {record.status === "Present" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {record.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground italic mt-3">* Dữ liệu điểm danh được cập nhật trực tiếp từ giáo viên chủ nhiệm.</p>
        </div>
      </div>
    </div>
  )
}

const GRADE_TINTS: Record<GradeId, string> = {
  6: "bg-sky-50 text-sky-700 border-sky-200",
  7: "bg-emerald-50 text-emerald-700 border-emerald-200",
  8: "bg-amber-50 text-amber-700 border-amber-200",
  9: "bg-primary/10 text-primary border-primary/20",
}

function GradesView({
  selectedGrade,
  onSelectGrade,
  onStart,
}: {
  selectedGrade: Grade | null
  onSelectGrade: (g: Grade | null) => void
  onStart: (title: string, topic?: Topic) => void
}) {
  if (selectedGrade) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => onSelectGrade(null)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách khối lớp
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{selectedGrade.label} — Chọn chủ đề</h1>
          <p className="mt-1 text-sm text-muted-foreground">{selectedGrade.description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {selectedGrade.topics.map((topic) => (
            <div key={topic.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {topic.category}
              </span>
              <h3 className="mt-3 text-base font-semibold text-foreground">{topic.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{topic.questionCount} câu hỏi</p>
              <Button
                onClick={() => onStart(`${selectedGrade.label} · ${topic.name}`, topic)}
                className="mt-4 w-full"
                variant="outline"
              >
                <Play className="h-4 w-4" />
                Bắt đầu luyện tập
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Chọn khối lớp</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chương trình bám sát chuẩn kiến thức của Bộ Giáo dục &amp; Đào tạo.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GRADES.map((grade) => (
          <button
            key={grade.id}
            onClick={() => onSelectGrade(grade)}
            className="group rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-bold",
                GRADE_TINTS[grade.id],
              )}
            >
              {grade.id}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{grade.label}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{grade.description}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
              {grade.topics.length} chủ đề
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tiến độ cá nhân</h1>
        <p className="mt-1 text-sm text-muted-foreground">Theo dõi mức độ thành thạo theo từng chủ đề.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-foreground">Tỷ lệ hoàn thành theo chủ đề</h2>
        <div className="space-y-5">
          {STUDENT_PROGRESS.map((p) => {
            const tone =
              p.percent >= 80 ? "bg-emerald-500" : p.percent >= 50 ? "bg-primary" : "bg-amber-500"
            return (
              <div key={p.topic}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{p.topic}</span>
                  <span className="font-semibold text-muted-foreground">{p.percent}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${p.percent}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Huy hiệu thành tích</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "flex flex-col items-center rounded-2xl border p-5 text-center",
                badge.unlocked ? "border-primary/20 bg-primary/5" : "border-border bg-muted/40 opacity-70",
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl",
                  badge.unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {badge.unlocked ? <Award className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{badge.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
