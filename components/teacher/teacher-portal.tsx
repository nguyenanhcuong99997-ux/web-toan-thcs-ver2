"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  LineChart,
  Sigma,
  LogOut,
  GraduationCap,
  Star,
  ClipboardCheck,
  CheckSquare,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  Award,
  DollarSign,
  HelpCircle,
  UserPlus,
  BookOpen,
  FilePlus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type View = "overview" | "students" | "progress" | "attendance" | "pdf-manager" | "tuition" | "homework"

interface TeacherPortalProps {
  userName: string
  onLogout: () => void
}

interface Student {
  id: string
  name: string
  gradeId: number
  avgScore: number
  testsTaken: number
}

// --- ĐỊNH NGHĨA INTERFACE CHO BTVN ---
interface Homework {
  id: string
  title: string
  gradeId: number
  deadline: string
  driveUrl: string
}

interface HomeworkSubmission {
  studentId: string
  status: "Submitted" | "Pending" | "Late"
  score: number | string
}

// Cập nhật Menu Điều Hướng thêm mục BTVN
const NAV = [
  { id: "overview" as View, label: "Tổng quan", icon: LayoutDashboard },
  { id: "students" as View, label: "Quản lý Học viên", icon: Users },
  { id: "homework" as View, label: "Giao & Check BTVN", icon: BookOpen },
  { id: "attendance" as View, label: "Điểm danh học sinh", icon: CheckSquare },
  { id: "tuition" as View, label: "Tính học phí tháng", icon: DollarSign },
  { id: "pdf-manager" as View, label: "Quản lý Đề PDF", icon: Upload },
  { id: "progress" as View, label: "Tiến độ Lớp học", icon: LineChart },
]

const INITIAL_STUDENTS: Student[] = [
  { id: "1", name: "Nguyễn Văn An", gradeId: 9, avgScore: 8.5, testsTaken: 12 },
  { id: "2", name: "Trần Thị Bình", gradeId: 9, avgScore: 7.2, testsTaken: 11 },
  { id: "3", name: "Lê Hoàng Châu", gradeId: 8, avgScore: 9.0, testsTaken: 14 },
]

const INITIAL_PDFS = [
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
]

// Dữ liệu BTVN mặc định ban đầu
const INITIAL_HOMEWORKS: Homework[] = [
  { id: "HW01", title: "BTVN Tuần 24: Hàm số bậc nhất và đồ thị", gradeId: 9, deadline: "2026-06-18", driveUrl: "https://drive.google.com" },
  { id: "HW02", title: "BTVN Hình học: Định lý Pitago và ứng dụng", gradeId: 8, deadline: "2026-06-20", driveUrl: "https://drive.google.com" },
]

const INITIAL_SUBMISSIONS: { [homeworkId: string]: { [studentId: string]: HomeworkSubmission } } = {
  "HW01": {
    "1": { studentId: "1", status: "Submitted", score: 8.5 },
    "2": { studentId: "2", status: "Pending", score: "" },
  }
}

export function TeacherPortal({ userName, onLogout }: TeacherPortalProps) {
  const [view, setView] = useState<View>("overview")

  // --- STATE QUẢN LÝ HỌC VIÊN ĐỒNG BỘ TOÀN HỆ THỐNG ---
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS)
  
  // State phục vụ việc Thêm / Sửa học viên
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentStudentId, setCurrentStudentId] = useState<string>("")
  const [studentForm, setStudentForm] = useState({ name: "", gradeId: 9, avgScore: 0, testsTaken: 0 })

  // --- STATE BTVN ---
  const [homeworks, setHomeworks] = useState<Homework[]>(INITIAL_HOMEWORKS)
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS)
  const [selectedHwId, setSelectedHwId] = useState<string>("HW01")
  
  // Form tạo BTVN mới
  const [newHwTitle, setNewHwTitle] = useState("")
  const [newHwGrade, setNewHwGrade] = useState<number>(9)
  const [newHwDeadline, setNewHwDeadline] = useState("2026-06-22")
  const [newHwUrl, setNewHwUrl] = useState("")

  // --- STATE ĐIỂM DANH ---
  const [attendanceDate, setAttendanceDate] = useState<string>("2026-06-15")
  const [attendanceRecords, setAttendanceRecords] = useState<{ [date: string]: { [studentId: string]: string } }>({
    "2026-06-12": { "1": "Present", "2": "Absent_Excused", "3": "Present" },
    "2026-06-14": { "1": "Present", "2": "Present", "3": "Present" }
  })
  
  // --- STATE HỌC PHÍ ---
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-06")
  const [studentPrices, setStudentPrices] = useState<{ [studentId: string]: number }>({
    "1": 150000, 
    "2": 150000, 
    "3": 130000, 
  })

  // --- STATE PDF ---
  const [pdfList, setPdfList] = useState(INITIAL_PDFS)
  const [newPdfTitle, setNewPdfTitle] = useState("")
  const [newPdfGrade, setNewPdfGrade] = useState("9")
  const [newPdfCategory, setNewPdfCategory] = useState("Thi thử vào 10")
  const [newPdfDriveUrl, setNewPdfDriveUrl] = useState("")

  // --- CÁC HÀM XỬ LÝ HỌC VIÊN (THÊM, SỬA, XÓA) ---
  const handleOpenAddForm = () => {
    setIsEditing(false)
    setCurrentStudentId("")
    setStudentForm({ name: "", gradeId: 9, avgScore: 0, testsTaken: 0 })
  }

  const handleOpenEditForm = (student: Student) => {
    setIsEditing(true)
    setCurrentStudentId(student.id)
    setStudentForm({
      name: student.name,
      gradeId: student.gradeId,
      avgScore: student.avgScore,
      testsTaken: student.testsTaken
    })
  }

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentForm.name.trim()) return

    if (isEditing) {
      setStudents(prev => prev.map(s => s.id === currentStudentId ? { ...s, ...studentForm } : s))
      alert("Đã cập nhật thông tin học viên thành công!")
    } else {
      const newId = String(Date.now())
      const newStudent: Student = {
        id: newId,
        name: studentForm.name.trim(),
        gradeId: Number(studentForm.gradeId),
        avgScore: Number(studentForm.avgScore) || 0,
        testsTaken: Number(studentForm.testsTaken) || 0
      }
      setStudents(prev => [...prev, newStudent])
      alert("Đã thêm học viên mới vào hệ thống TrueMath!")
    }

    handleOpenAddForm()
  }

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa học viên "${name}" khỏi lớp? Mọi dữ liệu liên quan sẽ bị gỡ bỏ.`)) {
      setStudents(prev => prev.filter(s => s.id !== id))
    }
  }

  // --- LOGIC XỬ LÝ BTVN ---
  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHwTitle.trim()) return

    const newHw: Homework = {
      id: `HW${Date.now()}`,
      title: newHwTitle.trim(),
      gradeId: Number(newHwGrade),
      deadline: newHwDeadline,
      driveUrl: newHwUrl.trim() || "https://drive.google.com"
    }

    setHomeworks([newHw, ...homeworks])
    setSelectedHwId(newHw.id) // Chuyển vùng chọn sang bài tập vừa tạo mới
    setNewHwTitle("")
    setNewHwUrl("")
    alert("Đã giao bài tập về nhà mới thành công!")
  }

  const handleUpdateSubmission = (studentId: string, field: "status" | "score", value: any) => {
    setSubmissions(prev => {
      const hwSubmissions = prev[selectedHwId] ? { ...prev[selectedHwId] } : {}
      const studentSub = hwSubmissions[studentId] || { studentId, status: "Pending", score: "" }
      
      if (field === "status") {
        studentSub.status = value
      }
      
      if (field === "score") {
        const oldScore = studentSub.score
        studentSub.score = value === "" ? "" : Number(value)
        
        // Tự động đồng bộ và tính toán lại điểm trung bình hệ thống khi giáo viên nhập điểm
        if (value !== "" && oldScore === "") {
          setStudents(prevStudents => prevStudents.map(student => {
            if (student.id === studentId) {
              const currentTotal = student.avgScore * student.testsTaken
              const newTestsCount = student.testsTaken + 1
              const newAvg = (currentTotal + Number(value)) / newTestsCount
              return { ...student, testsTaken: newTestsCount, avgScore: Number(newAvg.toFixed(1)) }
            }
            return student
          }))
        }
      }

      hwSubmissions[studentId] = studentSub
      return { ...prev, [selectedHwId]: hwSubmissions }
    })
  }

  // --- LOGIC HÀM ĐIỂM DANH ---
  const handleAttendanceChange = (studentId: string, status: "Present" | "Absent_Excused" | "Absent_Unexcused") => {
    setAttendanceRecords(prev => {
      const currentDayRecords = prev[attendanceDate] ? { ...prev[attendanceDate] } : {}
      currentDayRecords[studentId] = status
      return { ...prev, [attendanceDate]: currentDayRecords }
    })
  }

  const getStudentAttendanceStats = (studentId: string) => {
    let presentCount = 0
    let totalChecked = 0
    Object.keys(attendanceRecords).forEach((date) => {
      const record = attendanceRecords[date]?.[studentId]
      if (record) {
        totalChecked++
        if (record === "Present") presentCount++
      }
    })
    return { presentCount, totalChecked }
  }

  // --- LOGIC HÀM TÍNH HỌC PHÍ THÁNG ---
  const handlePriceChange = (studentId: string, newPrice: number) => {
    setStudentPrices(prev => ({ ...prev, [studentId]: newPrice }))
  }

  const calculateTuitionData = () => {
    const datesInMonth = Object.keys(attendanceRecords).filter(date => date.startsWith(selectedMonth))
    
    const summary = students.map(student => {
      let presentCount = 0
      let absentCount = 0

      datesInMonth.forEach(date => {
        const status = attendanceRecords[date]?.[student.id]
        if (status === "Present") presentCount++
        else if (status === "Absent_Excused" || status === "Absent_Unexcused") absentCount++
      })

      const currentPrice = studentPrices[student.id] !== undefined ? studentPrices[student.id] : 150000

      return {
        id: student.id,
        name: student.name,
        gradeId: student.gradeId,
        presentCount,
        absentCount,
        pricePerLesson: currentPrice,
        totalTuition: presentCount * currentPrice
      }
    })

    return { totalLessons: datesInMonth.length, summary }
  }

  const { totalLessons, summary: tuitionSummary } = calculateTuitionData()

  // --- LOGIC HÀM PHÁT HÀNH PDF ---
  const handleAddPdf = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPdfTitle.trim() || !newPdfDriveUrl.trim().includes("drive.google.com")) {
      alert("Vui lòng kiểm tra lại thông tin và link Google Drive!")
      return
    }
    const newPdf = {
      id: `PDF00${pdfList.length + 1}`,
      title: newPdfTitle.trim(),
      grade: newPdfGrade,
      category: newPdfCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: "Drive Link",
      driveUrl: newPdfDriveUrl.trim()
    }
    setPdfList([newPdf, ...pdfList])
    setNewPdfTitle("")
    setNewPdfDriveUrl("")
    alert("Đã phát hành tài liệu PDF thành công!")
  }

  // Lọc lấy bài tập đang được chọn và học sinh thuộc khối lớp của bài tập đó
  const activeHomework = homeworks.find(hw => hw.id === selectedHwId)
  const filteredStudentsForHw = students.filter(s => activeHomework ? s.gradeId === activeHomework.gradeId : true)

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
        <button onClick={onLogout} className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        {/* Mobile Nav */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <Sigma className="h-5 w-5 text-primary" />
            <span className="font-semibold">TrueMath</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout}><LogOut className="h-5 w-5" /></Button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 md:hidden">
          {NAV.map((item) => (
            <button key={item.id} onClick={() => setView(item.id)} className={cn("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium", view === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </div>

        {/* Nội dung vùng làm việc chính */}
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          {view === "overview" && <OverviewSummary students={students} pdfCount={pdfList.length} homeworkCount={homeworks.length} />}
          {view === "progress" && <ProgressView />}

          {/* VIEW GIAO VÀ CHECK BTVN */}
          {view === "homework" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Giao &amp; Kiểm tra bài tập về nhà</h1>
                <p className="mt-1 text-sm text-muted-foreground">Tạo phiếu bài tập bằng link PDF/Drive, theo dõi tình trạng làm bài và chấm điểm học viên.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form tạo BTVN */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 self-start">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <FilePlus className="h-4 w-4 text-primary" /> Tạo &amp; Giao bài tập mới
                  </h2>
                  <form onSubmit={handleCreateHomework} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Tiêu đề bài tập:</label>
                      <input type="text" required value={newHwTitle} onChange={(e) => setNewHwTitle(e.target.value)} placeholder="Ví dụ: Phiếu hình học tuần 25..." className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Giao cho Khối:</label>
                        <select value={newHwGrade} onChange={(e) => setNewHwGrade(Number(e.target.value))} className="w-full bg-muted/40 border border-border rounded-lg px-2.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
                          <option value={6}>Lớp 6</option><option value={7}>Lớp 7</option><option value={8}>Lớp 8</option><option value={9}>Lớp 9</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Hạn nộp bài:</label>
                        <input type="date" value={newHwDeadline} onChange={(e) => setNewHwDeadline(e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Link tệp đề bài (Drive / Web):</label>
                      <input type="url" value={newHwUrl} onChange={(e) => setNewHwUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                    </div>

                    <Button type="submit" className="w-full text-xs py-2"><PlusCircle className="w-4 h-4 mr-1.5" /> Phát hành &amp; Giao bài</Button>
                  </form>
                </div>

                {/* Bảng chấm và check tình trạng học sinh */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-border pb-3">
                    <div className="space-y-1 w-full max-w-md">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chọn bài tập cần kiểm tra:</label>
                      <select value={selectedHwId} onChange={(e) => setSelectedHwId(e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:border-primary">
                        {homeworks.map(hw => (
                          <option key={hw.id} value={hw.id}>{hw.title} (Lớp {hw.gradeId})</option>
                        ))}
                      </select>
                    </div>
                    {activeHomework && (
                      <a href={activeHomework.driveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline bg-primary/5 px-3 py-2.5 rounded-lg border border-primary/20 self-end sm:self-center"><ExternalLink className="w-3.5 h-3.5" /> Link tài liệu đề</a>
                    )}
                  </div>

                  {activeHomework ? (
                    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                              <th className="px-5 py-3.5">Học viên (Lớp {activeHomework.gradeId})</th>
                              <th className="px-5 py-3.5 text-center">Trạng thái làm bài</th>
                              <th className="px-5 py-3.5 text-center w-28">Điểm số</th>
                              <th className="px-5 py-3.5 text-center">Hành động nhanh</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {filteredStudentsForHw.map((student) => {
                              const sub = submissions[selectedHwId]?.[student.id] || { status: "Pending", score: "" }
                              
                              return (
                                <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                                  <td className="px-5 py-3.5 font-semibold text-foreground">{student.name}</td>
                                  <td className="px-5 py-3.5 text-center">
                                    {sub.status === "Submitted" ? (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Đã nộp bài</span>
                                    ) : sub.status === "Late" ? (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">Nộp muộn</span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">Chưa nộp</span>
                                    )}
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <div className="flex items-center border border-border rounded-lg bg-background px-2 py-0.5 focus-within:border-primary">
                                      <input type="number" step="0.1" min="0" max="10" placeholder="--" value={sub.score} onChange={(e) => handleUpdateSubmission(student.id, "score", e.target.value)} className="w-full bg-transparent border-none text-center font-bold text-sm focus:outline-none" />
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <div className="flex justify-center gap-1.5">
                                      <button onClick={() => handleUpdateSubmission(student.id, "status", "Submitted")} className={cn("px-2.5 py-1 text-xs font-medium rounded border transition-all", sub.status === "Submitted" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-background text-muted-foreground hover:bg-muted")}>Nộp</button>
                                      <button onClick={() => handleUpdateSubmission(student.id, "status", "Late")} className={cn("px-2.5 py-1 text-xs font-medium rounded border transition-all", sub.status === "Late" ? "bg-amber-500 border-amber-500 text-white" : "bg-background text-muted-foreground hover:bg-muted")}>Muộn</button>
                                      <button onClick={() => handleUpdateSubmission(student.id, "status", "Pending")} className={cn("px-2.5 py-1 text-xs font-medium rounded border transition-all", sub.status === "Pending" ? "bg-rose-600 border-rose-600 text-white" : "bg-background text-muted-foreground hover:bg-muted")}>Chưa</button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                            {filteredStudentsForHw.length === 0 && (
                              <tr>
                                <td colSpan={4} className="text-center py-6 italic text-muted-foreground">Không tìm thấy học sinh thuộc Lớp {activeHomework.gradeId} để kiểm tra.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">Vui lòng tạo một bài tập về nhà ở biểu mẫu bên cạnh để bắt đầu.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW QUẢN LÝ HỌC VIÊN */}
          {view === "students" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Quản lý cơ sở dữ liệu học viên</h1>
                <p className="mt-1 text-sm text-muted-foreground">Thêm học viên mới, sửa đổi hồ sơ hoặc xóa học viên ra khỏi danh sách lớp học.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Thêm/Sửa Học Viên */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 self-start">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-primary" /> 
                    {isEditing ? "Cập nhật thông tin học viên" : "Đăng ký học viên mới"}
                  </h2>
                  <form onSubmit={handleSaveStudent} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Họ và tên học sinh:</label>
                      <input 
                        type="text" 
                        required
                        value={studentForm.name} 
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        placeholder="Nhập tên đầy đủ..."
                        className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Khối lớp sinh hoạt:</label>
                      <select 
                        value={studentForm.gradeId} 
                        onChange={(e) => setStudentForm({ ...studentForm, gradeId: Number(e.target.value) })}
                        className="w-full bg-muted/40 border border-border rounded-lg px-2.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value={6}>Lớp 6</option>
                        <option value={7}>Lớp 7</option>
                        <option value={8}>Lớp 8</option>
                        <option value={9}>Lớp 9</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Điểm TB khởi điểm:</label>
                        <input 
                          type="number" 
                          step="0.1" 
                          min="0" 
                          max="10"
                          value={studentForm.avgScore}
                          onChange={(e) => setStudentForm({ ...studentForm, avgScore: Number(e.target.value) })}
                          className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Số bài đã làm:</label>
                        <input 
                          type="number" 
                          min="0"
                          value={studentForm.testsTaken}
                          onChange={(e) => setStudentForm({ ...studentForm, testsTaken: Number(e.target.value) })}
                          className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1 text-xs">
                        {isEditing ? "Cập nhật ngay" : "Thêm vào lớp"}
                      </Button>
                      {isEditing && (
                        <Button type="button" variant="outline" onClick={handleOpenAddForm} className="text-xs">
                          Hủy sửa
                        </Button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Bảng Hiển Thị Danh Sách Học Viên */}
                <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                          <th className="px-5 py-3.5">Học viên</th>
                          <th className="px-5 py-3.5 text-center">Khối</th>
                          <th className="px-5 py-3.5 text-center">Điểm số TB</th>
                          <th className="px-5 py-3.5 text-center">Số bài kiểm tra</th>
                          <th className="px-5 py-3.5 text-right">Tác vụ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-5 py-3.5 font-semibold text-foreground">{student.name}</td>
                            <td className="px-5 py-3.5 text-center text-muted-foreground">Lớp {student.gradeId}</td>
                            <td className="px-5 py-3.5 text-center font-bold text-primary">{student.avgScore.toFixed(1)}</td>
                            <td className="px-5 py-3.5 text-center text-muted-foreground">{student.testsTaken} bài</td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => handleOpenEditForm(student)}
                                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                                  title="Chỉnh sửa thông tin"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteStudent(student.id, student.name)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-md transition-colors"
                                  title="Xóa học viên"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {students.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-muted-foreground italic">
                              Lớp chưa có học viên nào. Hãy thêm học viên ở form bên cạnh!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW ĐIỂM DANH HỌC SINH */}
          {view === "attendance" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Điểm danh học sinh hàng ngày</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Theo dõi chuyên cần. Các nút ở trạng thái chờ cho đến khi tích chọn.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 text-sm font-medium shadow-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="border-none bg-transparent text-xs font-semibold focus:outline-none cursor-pointer" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                        <th className="px-6 py-4">Tên học viên</th>
                        <th className="px-6 py-4">Khối Lớp</th>
                        <th className="px-6 py-4 text-center bg-primary/5 text-primary font-bold">Lịch sử đi học</th>
                        <th className="px-6 py-4 text-center">Trạng thái hôm nay</th>
                        <th className="px-6 py-4 text-center">Chọn trạng thái điểm danh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {students.map((student) => {
                        const currentStatus = attendanceRecords[attendanceDate]?.[student.id]
                        const { presentCount, totalChecked } = getStudentAttendanceStats(student.id)

                        return (
                          <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4 font-semibold text-foreground">{student.name}</td>
                            <td className="px-6 py-4 text-muted-foreground">Lớp {student.gradeId}</td>
                            <td className="px-6 py-4 text-center bg-primary/5">
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                <Award className="h-3.5 w-3.5" /> {presentCount} / {totalChecked} buổi
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {!currentStatus ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground border border-dashed border-neutral-300"><HelpCircle className="h-3 w-3" /> Chưa điểm danh</span>
                              ) : currentStatus === "Present" ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700"><CheckCircle className="h-3 w-3" /> Có mặt</span>
                              ) : currentStatus === "Absent_Excused" ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700"><AlertCircle className="h-3 w-3" /> Vắng có phép</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700"><XCircle className="h-3 w-3" /> Vắng ko phép</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center items-center gap-2">
                                <button type="button" onClick={() => handleAttendanceChange(student.id, "Present")} className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shadow-sm", currentStatus === "Present" ? "bg-emerald-600 border-emerald-600 text-white font-bold" : "bg-background border-border text-muted-foreground hover:bg-muted/40")}>Có mặt</button>
                                <button type="button" onClick={() => handleAttendanceChange(student.id, "Absent_Excused")} className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shadow-sm", currentStatus === "Absent_Excused" ? "bg-amber-500 border-amber-500 text-white font-bold" : "bg-background border-border text-muted-foreground hover:bg-muted/40")}>Vắng có phép</button>
                                <button type="button" onClick={() => handleAttendanceChange(student.id, "Absent_Unexcused")} className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shadow-sm", currentStatus === "Absent_Unexcused" ? "bg-rose-600 border-rose-600 text-white font-bold" : "bg-background border-border text-muted-foreground hover:bg-muted/40")}>Vắng không phép</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW TÍNH HỌC PHÍ THÁNG */}
          {view === "tuition" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Tổng hợp &amp; Điều chỉnh Học phí</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Tính phí theo đơn giá riêng biệt của học viên nhân số ngày có mặt thực tế.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 text-sm font-medium shadow-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border-none bg-transparent text-xs font-semibold focus:outline-none" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                        <th className="px-6 py-4">Tên học viên</th>
                        <th className="px-6 py-4">Khối</th>
                        <th className="px-6 py-4 text-center">Số buổi đi học</th>
                        <th className="px-6 py-4 text-center">Số buổi vắng</th>
                        <th className="px-6 py-4 text-center w-48">Đơn giá / Buổi học</th>
                        <th className="px-6 py-4 text-right">Thành tiền</th>
                        <th className="px-6 py-4 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {tuitionSummary.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground">{item.name}</td>
                          <td className="px-6 py-4 text-muted-foreground">Lớp {item.gradeId}</td>
                          <td className="px-6 py-4 text-center font-bold text-emerald-600">{item.presentCount} buổi</td>
                          <td className="px-6 py-4 text-center text-amber-600">{item.absentCount} buổi</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1 border border-border bg-background rounded-lg px-2 py-1 max-w-[150px] mx-auto focus-within:border-primary transition-all">
                              <input type="number" step="5000" value={item.pricePerLesson} onChange={(e) => handlePriceChange(item.id, Number(e.target.value))} className="w-full border-none bg-transparent text-xs font-bold text-foreground text-right focus:outline-none" />
                              <span className="text-[11px] text-muted-foreground font-semibold">đ</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-extrabold text-foreground text-sm">{item.totalTuition.toLocaleString("vi-VN")} đ</td>
                          <td className="px-6 py-4 text-center">
                            <Button size="sm" variant="outline" onClick={() => alert(`Đã gửi biên lai cho em ${item.name}: ${item.totalTuition.toLocaleString("vi-VN")}đ`)}>Gửi thông báo</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW QUẢN LÝ LINK ĐỀ THI PDF */}
          {view === "pdf-manager" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Quản lý &amp; Phát hành đề luyện tập PDF (Google Drive)</h1>
                <p className="mt-1 text-sm text-muted-foreground">Phát hành tài liệu học tập từ tài khoản Google Drive cá nhân của bạn xuống app học sinh.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 self-start">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Upload className="h-4 w-4 text-primary" /> Phát hành tài liệu mới</h2>
                  <form onSubmit={handleAddPdf} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Tiêu đề đề thi/Tài liệu:</label>
                      <input type="text" required value={newPdfTitle} onChange={(e) => setNewPdfTitle(e.target.value)} placeholder="Ví dụ: Đề thi khảo sát chất lượng..." className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Khối:</label>
                        <select value={newPdfGrade} onChange={(e) => setNewPdfGrade(e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:border-primary"><option value="6">Lớp 6</option><option value="7">Lớp 7</option><option value="8">Lớp 8</option><option value="9">Lớp 9</option></select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Phân loại:</label>
                        <select value={newPdfCategory} onChange={(e) => setNewPdfCategory(e.target.value)} className="w-full bg-muted/40 border border-border rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:border-primary"><option value="Thi thử vào 10">Thi thử vào 10</option><option value="Ôn thi Học Kỳ">Ôn thi Học Kỳ</option><option value="Tài liệu học tập">Tài liệu học tập</option></select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Đường liên kết Google Drive:</label>
                      <input type="url" required value={newPdfDriveUrl} onChange={(e) => setNewPdfDriveUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                    </div>
                    <Button type="submit" className="w-full gap-1.5 py-2"><PlusCircle className="h-4 w-4" /> Phát hành tài liệu</Button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Danh sách đề đang phát hành</h2>
                  <div className="space-y-3">
                    {pdfList.map((pdf) => (
                      <div key={pdf.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm gap-3">
                        <div className="flex gap-3 items-start">
                          <div className="p-2 rounded-lg bg-rose-50 text-rose-600"><FileText className="w-5 h-5" /></div>
                          <div>
                            <h3 className="text-sm font-bold text-foreground line-clamp-1">{pdf.title}</h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="font-semibold text-primary">Lớp {pdf.grade}</span>
                              <span>•</span>
                              <span>{pdf.category}</span>
                              <span>•</span>
                              <span>{pdf.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                        <a href={pdf.driveUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-border hover:bg-muted text-muted-foreground transition-all"><ExternalLink className="w-3.5 h-3.5" /> Mở Drive</a>
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

// COMPONENT CON: THỐNG KÊ TỔNG QUAN
function OverviewSummary({ students, pdfCount, homeworkCount }: { students: Student[]; pdfCount: number; homeworkCount: number }) {
  const totalStudents = students.length
  const avgScore = totalStudents > 0 ? (students.reduce((a, s) => a + s.avgScore, 0) / totalStudents).toFixed(1) : "0.0"

  const kpis = [
    { label: "Tổng số học viên", value: String(totalStudents), icon: Users, tint: "text-primary bg-primary/10" },
    { label: "Điểm TB toàn lớp", value: avgScore, icon: Star, tint: "text-amber-600 bg-amber-50" },
    { label: "Bài tập về nhà đã giao", value: String(homeworkCount), icon: BookOpen, tint: "text-indigo-600 bg-indigo-50" },
    { label: "Tài liệu đề thi PDF", value: String(pdfCount), icon: Upload, tint: "text-sky-600 bg-sky-50" },
  ]

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Tổng quan thống kê trung tâm</h1></div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", k.tint)}><k.icon className="h-5 w-5" /></div>
            <p className="text-2xl font-bold text-foreground">{k.value}</p><p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgressView() {
  return <div className="p-6 border border-border rounded-2xl bg-card text-sm font-medium">Biểu đồ tổng quan mức độ thành thạo các chủ đề Toán học của lớp.</div>
}
