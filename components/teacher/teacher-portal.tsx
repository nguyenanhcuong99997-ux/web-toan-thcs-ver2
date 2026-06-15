"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  LineChart,
  PenSquare,
  Sigma,
  LogOut,
  GraduationCap,
  Star,
  ClipboardCheck,
  TrendingUp,
  CheckSquare,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  PlusCircle,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { STUDENTS } from "@/lib/mock-data"
import { StudentManagement } from "./student-management"
import { LatexCreator } from "./latex-creator"

// Cập nhật Type các View hiển thị trong hệ thống
type View = "overview" | "students" | "progress" | "create" | "attendance" | "pdf-manager"

interface TeacherPortalProps {
  userName: string
  onLogout: () => void
}

// Thêm 2 mục mới vào Menu điều hướng chuẩn của Giáo viên
const NAV = [
  { id: "overview" as View, label: "Tổng quan", icon: LayoutDashboard },
  { id: "students" as View, label: "Quản lý Học viên", icon: Users },
  { id: "attendance" as View, label: "Điểm danh học sinh", icon: CheckSquare },
  { id: "pdf-manager" as View, label: "Quản lý Đề PDF", icon: Upload },
  { id: "progress" as View, label: "Tiến độ Lớp học", icon: LineChart },
  { id: "create" as View, label: "Soạn đề bài (LaTeX)", icon: PenSquare },
]

// Mock data ban đầu cho danh sách file PDF luyện tập
const INITIAL_PDFS = [
  { id: "PDF001", title: "Đề thi thử Vào Lớp 10 chung Toàn Tỉnh - Đề số 1", grade: "9", category: "Thi thử vào 10", uploadDate: "2026-06-12", fileSize: "1.2 MB" },
  { id: "PDF002", title: "Đề cương Tổng ôn tập Kiến thức trọng tâm Toán 8 học kỳ 2", grade: "8", category: "Tài liệu học tập", uploadDate: "2026-06-14", fileSize: "2.1 MB" },
]

export function TeacherPortal({ userName, onLogout }: TeacherPortalProps) {
  const [view, setView] = useState<View>("overview")

  // Quản lý State cục bộ phục vụ cho Điểm danh & PDF
  const [attendanceDate, setAttendanceDate] = useState<string>("2026-06-15")
  const [attendanceRecords, setAttendanceRecords] = useState<{ [key: string]: { [studentId: string]: string } }>({
    "2026-06-15": {
      "1": "Present", "2": "Present", "3": "Absent_Excused"
    }
  })
  
  const [pdfList, setPdfList] = useState(INITIAL_PDFS)
  const [newPdfTitle, setNewPdfTitle] = useState("")
  const [newPdfGrade, setNewPdfGrade] = useState("9")
  const [newPdfCategory, setNewPdfCategory] = useState("Thi thử vào 10")
  
  // State mới để lưu trữ File thật từ hệ thống máy tính
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Hàm xử lý thay đổi nhanh trạng thái điểm danh của học sinh
  const handleAttendanceChange = (studentId: string, status: "Present" | "Absent_Excused" | "Absent_Unexcused") => {
    setAttendanceRecords(prev => ({
      ...prev,
      [attendanceDate]: {
        ...(prev[attendanceDate] || {}),
        [studentId]: status
      }
    }))
  }

  // Hàm định dạng kích thước byte sang KB hoặc MB hiển thị trực quan
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  // Hàm lắng nghe sự kiện chọn tệp của thẻ input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "application/pdf") {
        alert("Hệ thống chỉ chấp nhận định dạng tệp tin .pdf")
        return
      }
      if (file.size > 15 * 1024 * 1024) {
        alert("Kích thước tệp tin vượt quá giới hạn 15MB")
        return
      }
      setSelectedFile(file)
      // Tự động điền tiêu đề bằng tên file (bỏ đuôi mở rộng) nếu giáo viên chưa nhập gì
      if (!newPdfTitle.trim()) {
        setNewPdfTitle(file.name.replace(/\.[^/.]+$/, ""))
      }
    }
  }

  // Hàm xử lý khi giáo viên bấm nút Upload file PDF lên hệ thống
  const handleAddPdf = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPdfTitle.trim()) {
      alert("Vui lòng điền tiêu đề cho tài liệu!")
      return
    }
    if (!selectedFile) {
      alert("Vui lòng đính kèm tệp tin tài liệu PDF trước khi phát hành!")
      return
    }

    const newPdf = {
      id: `PDF00${pdfList.length + 1}`,
      title: newPdfTitle,
      grade: newPdfGrade,
      category: newPdfCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: formatFileSize(selectedFile.size) // Lấy dung lượng thật của file vừa chọn
    }

    setPdfList([newPdf, ...pdfList])
    
    // Reset toàn bộ form sau khi đưa dữ liệu lên state thành công
    setNewPdfTitle("")
    setSelectedFile(null)
    alert("Đã đăng tải và phát hành tệp đề thi PDF thành công lên hệ thống học viên!")
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <div className="mb-8 flex items-center gap-3 px-2 pt-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sigma className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">TrueMath THCS</p>
            <p className="text-xs text-sidebar-foreground/60">Cổng giáo viên</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
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
        <div className="mt-4 rounded-xl bg-sidebar-accent p-3">
          <p className="text-sm font-medium text-sidebar-foreground">{userName}</p>
          <p className="text-xs text-sidebar-foreground/60">Giáo viên Toán</p>
        </div>
        <button
          onClick={onLogout}
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        {/* Mobile nav */}
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
              onClick={() => setView(item.id)}
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

        {/* Định tuyến hiển thị View tương ứng */}
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          {view === "overview" && <OverviewView pdfCount={pdfList.length} />}
          {view === "students" && <StudentManagement />}
          {view === "progress" && <ProgressView />}
          {view === "create" && <LatexCreator />}

          {/* VIEW ĐIỂM DANH HỌC SINH MỚI TÍCH HỢP */}
          {view === "attendance" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Điểm danh học sinh hàng ngày</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Theo dõi và cập nhật trạng thái chuyên cần lớp trực tuyến.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 text-sm font-medium shadow-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Chọn ngày:</span>
                  <input 
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border-none bg-transparent text-xs font-semibold focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                        <th className="px-6 py-4">Tên học viên</th>
                        <th className="px-6 py-4">Khối Lớp</th>
                        <th className="px-6 py-4 text-center">Trạng thái điểm danh ngày {attendanceDate}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {STUDENTS.map((student) => {
                        const currentStatus = attendanceRecords[attendanceDate]?.[student.id] || "Present"
                        return (
                          <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4 font-semibold text-foreground">{student.name}</td>
                            <td className="px-6 py-4 text-muted-foreground">Lớp {student.gradeId}</td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() => handleAttendanceChange(String(student.id), "Present")}
                                  className={cn(
                                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                                    currentStatus === "Present" 
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm" 
                                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <CheckCircle className="h-3.5 w-3.5" /> Có mặt
                                </button>
                                <button
                                  onClick={() => handleAttendanceChange(String(student.id), "Absent_Excused")}
                                  className={cn(
                                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                                    currentStatus === "Absent_Excused" 
                                      ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm" 
                                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <AlertCircle className="h-3.5 w-3.5" /> Vắng có phép
                                </button>
                                <button
                                  onClick={() => handleAttendanceChange(String(student.id), "Absent_Unexcused")}
                                  className={cn(
                                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                                    currentStatus === "Absent_Unexcused" 
                                      ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm" 
                                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <XCircle className="h-3.5 w-3.5" /> Vắng không phép
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => alert("Hệ thống dữ liệu học bạ TrueMath đã đồng bộ bảng điểm danh thành công!")}>Lưu sổ điểm danh</Button>
              </div>
            </div>
          )}

          {/* VIEW QUẢN LÝ TẢI FILE ĐỀ THI PDF ĐÃ SỬA TÍNH NĂNG THẬT */}
          {view === "pdf-manager" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Quản lý & Đăng tải đề luyện tập PDF</h1>
                <p className="mt-1 text-sm text-muted-foreground">Đưa các file tài liệu, đề thi tự luận nâng cao định dạng PDF xuống kho đề của học sinh.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Form thêm tài liệu mới ở cột trái */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 self-start">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" /> Đăng đề luyện mới
                  </h2>
                  <form onSubmit={handleAddPdf} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Tiêu đề đề thi/Tài liệu:</label>
                      <input 
                        type="text"
                        required
                        value={newPdfTitle}
                        onChange={(e) => setNewPdfTitle(e.target.value)}
                        placeholder="Ví dụ: Đề khảo sát chất lượng giữa kì 2..."
                        className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary placeholder-muted-foreground/60"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Cấu hình Khối:</label>
                        <select 
                          value={newPdfGrade}
                          onChange={(e) => setNewPdfGrade(e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-lg px-2.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="6">Lớp 6</option>
                          <option value="7">Lớp 7</option>
                          <option value="8">Lớp 8</option>
                          <option value="9">Lớp 9</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Phân loại:</label>
                        <select 
                          value={newPdfCategory}
                          onChange={(e) => setNewPdfCategory(e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-lg px-2.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="Thi thử vào 10">Thi thử vào 10</option>
                          <option value="Ôn thi Học Kỳ">Ôn thi Học Kỳ</option>
                          <option value="Tài liệu học tập">Tài liệu học tập</option>
                        </select>
                      </div>
                    </div>

                    {/* VÙNG CHỌN FILE THẬT ĐƯỢC CẬP NHẬT */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Đính kèm tệp tin:</label>
                      <label 
                        className={cn(
                          "border-2 border-dashed rounded-xl p-4 text-center bg-muted/20 cursor-pointer hover:border-primary/50 transition-all block relative",
                          selectedFile ? "border-emerald-500/50 bg-emerald-50/10" : "border-border"
                        )}
                      >
                        {/* Thẻ input file ẩn hoàn toàn để xử lý logic */}
                        <input 
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        
                        {selectedFile ? (
                          <div className="space-y-1">
                            <CheckCircle className="h-7 w-7 mx-auto text-emerald-500 mb-1" />
                            <span className="text-xs font-semibold text-foreground block max-w-[200px] mx-auto truncate">
                              {selectedFile.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground block font-medium">
                              ({formatFileSize(selectedFile.size)}) - Sẵn sàng
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <FileText className="h-7 w-7 mx-auto text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground block font-medium">
                              Nhấp để chọn file .pdf từ thiết bị
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 block">
                              Dung lượng tối đa hỗ trợ: 15MB
                            </span>
                          </div>
                        )}
                      </label>
                    </div>

                    <Button type="submit" className="w-full gap-1.5 py-2">
                      <PlusCircle className="h-4 w-4" /> Phát hành tài liệu
                    </Button>
                  </form>
                </div>

                {/* Danh sách các tài liệu PDF đã đưa lên ở cột phải */}
                <div className="lg:col-span-2 space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Danh sách đề PDF đang phát hành trên hệ thống</h2>
                  <div className="space-y-2.5">
                    {pdfList.map((pdf) => (
                      <div key={pdf.id} className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between text-sm">
                        <div className="flex gap-3 items-center">
                          <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="font-semibold text-foreground">{pdf.title}</h4>
                            <div className="flex items-center gap-3 text-muted-foreground text-xs">
                              <span className="text-primary font-medium">{pdf.category}</span>
                              <span>• Khối Lớp {pdf.grade}</span>
                              <span>• Dung lượng: {pdf.fileSize}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if(confirm("Bạn có chắc muốn gỡ file tài liệu PDF này xuống không?")) {
                              setPdfList(prev => prev.filter(p => p.id !== pdf.id))
                            }
                          }}
                          className="p-2 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                          title="Xóa tài liệu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Component con OverviewView nhận prop hiển thị động số lượng tài liệu PDF lên KPI
function OverviewView({ pdfCount }: { pdfCount: number }) {
  const totalStudents = STUDENTS.length
  const avgScore = (STUDENTS.reduce((a, s) => a + s.avgScore, 0) / totalStudents).toFixed(1)
  const totalTests = STUDENTS.reduce((a, s) => a + s.testsTaken, 0)

  const kpis = [
    { label: "Tổng số học viên", value: String(totalStudents), icon: Users, tint: "text-primary bg-primary/10" },
    { label: "Điểm TB toàn lớp", value: avgScore, icon: Star, tint: "text-amber-600 bg-amber-50" },
    { label: "Bài đã chấm", value: String(totalTests), icon: ClipboardCheck, tint: "text-emerald-600 bg-emerald-50" },
    { label: "Tài liệu đề thi PDF", value: String(pdfCount), icon: Upload, tint: "text-sky-600 bg-sky-50" },
  ]

  const gradeBreakdown = [6, 7, 8, 9].map((g) => ({
    grade: g,
    count: STUDENTS.filter((s) => s.gradeId === g).length,
  }))
  const maxCount = Math.max(...gradeBreakdown.map((g) => g.count), 1)

  const topStudents = [...STUDENTS].sort((a, b) => b.avgScore - a.avgScore).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tổng quan</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bức tranh toàn cảnh về tình hình học tập của các lớp.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", k.tint)}>
              <k.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Phân bố học viên theo khối</h2>
          <div className="flex items-end justify-around gap-4" style={{ height: "180px" }}>
            {gradeBreakdown.map((g) => (
              <div key={g.grade} className="flex flex-1 flex-col items-center justify-end gap-2">
                <span className="text-sm font-semibold text-foreground">{g.count}</span>
                <div
                  className="w-full rounded-t-lg bg-primary transition-all"
                  style={{ height: `${(g.count / maxCount) * 140}px` }}
                />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Lớp {g.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Học viên xuất sắc</h2>
          <div className="space-y-3">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    i === 0 ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">Lớp {s.gradeId}</p>
                </div>
                <span className="text-sm font-bold text-primary">{s.avgScore.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const CLASS_MASTERY = [
  { topic: "Số học & Số tự nhiên", percent: 84 },
  { topic: "Hằng đẳng thức đáng nhớ", percent: 79 },
  { topic: "Căn bậc hai", percent: 72 },
  { topic: "Hàm số bậc nhất & bậc hai", percent: 66 },
  { topic: "Đường tròn", percent: 61 },
  { topic: "Hệ thức lượng trong tam giác", percent: 47 },
]

function ProgressView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tiến độ Lớp học</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mức độ thành thạo trung bình của toàn lớp theo từng chủ đề kiến thức.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-foreground">Mức độ thành thạo theo chủ đề</h2>
        <div className="space-y-5">
          {CLASS_MASTERY.map((m) => {
            const label = m.percent >= 75 ? "Tốt" : m.percent >= 60 ? "Trung bình" : "Cần cải thiện"
            const tone = m.percent >= 75 ? "bg-emerald-500" : m.percent >= 60 ? "bg-primary" : "bg-amber-500"
            const labelTone =
              m.percent >= 75 ? "text-emerald-600" : m.percent >= 60 ? "text-primary" : "text-amber-600"
            return (
              <div key={m.topic}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{m.topic}</span>
                  <span className={cn("font-semibold", labelTone)}>
                    {m.percent}% — {label}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${m.percent}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Chủ đề mạnh nhất", value: "Số học", desc: "84% thành thạo", tone: "text-emerald-600" },
          { label: "Cần tập trung", value: "Hệ thức lượng", desc: "47% thành thạo", tone: "text-amber-600" },
          { label: "Tiến bộ tuần này", value: "+12%", desc: "so với tuần trước", tone: "text-primary" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className={cn("mt-1 text-lg font-bold", c.tone)}>{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
