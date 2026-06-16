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
  CheckSquare,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  PlusCircle,
  Trash2,
  ExternalLink,
  Award,
  DollarSign,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { STUDENTS } from "@/lib/mock-data"
import { StudentManagement } from "./student-management"
import { LatexCreator } from "./latex-creator"

type View = "overview" | "students" | "progress" | "create" | "attendance" | "pdf-manager" | "tuition"

interface TeacherPortalProps {
  userName: string
  onLogout: () => void
}

const NAV = [
  { id: "overview" as View, label: "Tổng quan", icon: LayoutDashboard },
  { id: "students" as View, label: "Quản lý Học viên", icon: Users },
  { id: "attendance" as View, label: "Điểm danh học sinh", icon: CheckSquare },
  { id: "tuition" as View, label: "Tính học phí tháng", icon: DollarSign },
  { id: "pdf-manager" as View, label: "Quản lý Đề PDF", icon: Upload },
  { id: "progress" as View, label: "Tiến độ Lớp học", icon: LineChart },
  { id: "create" as View, label: "Soạn đề bài (LaTeX)", icon: PenSquare },
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

export function TeacherPortal({ userName, onLogout }: TeacherPortalProps) {
  const [view, setView] = useState<View>("overview")

  // Quản lý State điểm danh & Phát hành đề PDF
  const [attendanceDate, setAttendanceDate] = useState<string>("2026-06-15")
  
  // Dữ liệu điểm danh mẫu (Để trống ngày 15/06/2026 để kiểm tra tính năng "Chưa điểm danh")
  const [attendanceRecords, setAttendanceRecords] = useState<{ [date: string]: { [studentId: string]: string } }>({
    "2026-06-12": { "1": "Present", "2": "Absent_Excused", "3": "Present" },
    "2026-06-14": { "1": "Present", "2": "Present", "3": "Present" },
    // Ngày 2026-06-15 hiện tại chưa có bản ghi nào để kiểm tra trạng thái mặc định mới
  })
  
  // Quản lý cấu hình tháng xem học phí & học phí riêng cho từng học sinh
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-06")
  const [studentPrices, setStudentPrices] = useState<{ [studentId: string]: number }>({
    "1": 150000, 
    "2": 150000, 
    "3": 130000, 
  })

  const [pdfList, setPdfList] = useState(INITIAL_PDFS)
  const [newPdfTitle, setNewPdfTitle] = useState("")
  const [newPdfGrade, setNewPdfGrade] = useState("9")
  const [newPdfCategory, setNewPdfCategory] = useState("Thi thử vào 10")
  const [newPdfDriveUrl, setNewPdfDriveUrl] = useState("")

  // Hàm xử lý thay đổi trạng thái điểm danh
  const handleAttendanceChange = (studentId: string, status: "Present" | "Absent_Excused" | "Absent_Unexcused") => {
    setAttendanceRecords(prev => {
      const currentDayRecords = prev[attendanceDate] ? { ...prev[attendanceDate] } : {}
      currentDayRecords[studentId] = status
      
      return {
        ...prev,
        [attendanceDate]: currentDayRecords
      }
    })
  }

  // Hàm cập nhật đơn giá học phí tùy chỉnh
  const handlePriceChange = (studentId: string, newPrice: number) => {
    setStudentPrices(prev => ({
      ...prev,
      [studentId]: newPrice
    }))
  }

  // Hàm xử lý Phát hành tài liệu Google Drive mới
  const handleAddPdf = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPdfTitle.trim()) {
      alert("Vui lòng điền tiêu đề cho tài liệu!")
      return
    }
    if (!newPdfDriveUrl.trim() || !newPdfDriveUrl.includes("drive.google.com")) {
      alert("Vui lòng nhập đường liên kết hợp lệ từ Google Drive!")
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
    alert("Đã liên kết và phát hành tài liệu Google Drive thành công lên hệ thống học viên!")
  }

  // Thống kê tổng số buổi đi học trong lịch sử
  const getStudentAttendanceStats = (studentId: string) => {
    let presentCount = 0
    let totalChecked = 0

    Object.keys(attendanceRecords).forEach((date) => {
      const record = attendanceRecords[date]?.[studentId]
      if (record) {
        totalChecked++
        if (record === "Present") {
          presentCount++
        }
      }
    })

    return { presentCount, totalChecked }
  }

  // Tính toán chi tiết học phí theo tháng dựa trên các buổi có trạng thái "Present"
  const calculateTuitionData = () => {
    const datesInMonth = Object.keys(attendanceRecords).filter(date => date.startsWith(selectedMonth))

    const summary = STUDENTS.map(student => {
      let presentCount = 0
      let absentCount = 0

      datesInMonth.forEach(date => {
        const status = attendanceRecords[date]?.[student.id]
        if (status === "Present") {
          presentCount++
        } else if (status === "Absent_Excused" || status === "Absent_Unexcused") {
          absentCount++
        }
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

        {/* Nội dung vùng làm việc chính */}
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          {view === "overview" && <OverviewView pdfCount={pdfList.length} />}
          {view === "students" && <StudentManagement />}
          {view === "progress" && <ProgressView />}
          {view === "create" && <LatexCreator />}

          {/* VIEW ĐIỂM DANH HỌC SINH (ĐÃ ĐƯỢC TỐI ƯU THÔNG MINH) */}
          {view === "attendance" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Điểm danh học sinh hàng ngày</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Theo dõi trạng thái chuyên cần. Các nút sẽ ở trạng thái chờ cho đến khi bạn tích chọn.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 text-sm font-medium shadow-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Chọn ngày:</span>
                  <input 
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border-none bg-transparent text-xs font-semibold focus:outline-none focus:ring-0 cursor-pointer"
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
                        <th className="px-6 py-4 text-center bg-primary/5 text-primary font-bold">Lịch sử đi học</th>
                        <th className="px-6 py-4 text-center">Trạng thái hôm nay</th>
                        <th className="px-6 py-4 text-center">Chọn trạng thái điểm danh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {STUDENTS.map((student) => {
                        // THAY ĐỔI QUAN TRỌNG: Mặc định là undefined nếu chưa bấm điểm danh ngày này
                        const currentStatus = attendanceRecords[attendanceDate]?.[String(student.id)]
                        const { presentCount, totalChecked } = getStudentAttendanceStats(String(student.id))

                        return (
                          <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4 font-semibold text-foreground">{student.name}</td>
                            <td className="px-6 py-4 text-muted-foreground">Lớp {student.gradeId}</td>
                            
                            <td className="px-6 py-4 text-center bg-primary/5">
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                <Award className="h-3.5 w-3.5" />
                                {presentCount} / {totalChecked} buổi
                              </span>
                            </td>

                            {/* Cột hiển thị trạng thái hiện tại một cách rõ ràng */}
                            <td className="px-6 py-4 text-center">
                              {!currentStatus ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground border border-dashed border-neutral-300">
                                  <HelpCircle className="h-3 w-3" /> Chưa điểm danh
                                </span>
                              ) : currentStatus === "Present" ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                  <CheckCircle className="h-3 w-3" /> Có mặt
                                </span>
                              ) : currentStatus === "Absent_Excused" ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                                  <AlertCircle className="h-3 w-3" /> Vắng có phép
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">
                                  <XCircle className="h-3 w-3" /> Vắng ko phép
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAttendanceChange(String(student.id), "Present")}
                                  className={cn(
                                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shadow-sm",
                                    currentStatus === "Present" 
                                      ? "bg-emerald-600 border-emerald-600 text-white font-bold" 
                                      : "bg-background border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                  )}
                                >
                                  Có mặt
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAttendanceChange(String(student.id), "Absent_Excused")}
                                  className={cn(
                                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shadow-sm",
                                    currentStatus === "Absent_Excused" 
                                      ? "bg-amber-500 border-amber-500 text-white font-bold" 
                                      : "bg-background border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                  )}
                                >
                                  Vắng có phép
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAttendanceChange(String(student.id), "Absent_Unexcused")}
                                  className={cn(
                                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shadow-sm",
                                    currentStatus === "Absent_Unexcused" 
                                      ? "bg-rose-600 border-rose-600 text-white font-bold" 
                                      : "bg-background border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                  )}
                                >
                                  Vắng không phép
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
                <Button onClick={() => alert(`Đã đồng bộ và cập nhật thành công sổ điểm danh ngày ${attendanceDate} vào cơ sở dữ liệu TrueMath!`)}>
                  Lưu sổ điểm danh
                </Button>
              </div>
            </div>
          )}

          {/* VIEW TÍNH HỌC PHÍ THÁNG */}
          {view === "tuition" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Tổng hợp &amp; Điều chỉnh Học phí</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Theo dõi số buổi đi học thực tế và cấu hình đơn giá riêng biệt cho từng học sinh.</p>
                </div>
                
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 text-sm font-medium shadow-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Tháng tính phí:</span>
                  <input 
                    type="month" 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)} 
                    className="border-none bg-transparent text-xs font-semibold focus:outline-none focus:ring-0 cursor-pointer" 
                  />
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Số buổi tổ chức dạy học trong tháng <strong className="text-primary">{selectedMonth}</strong> ghi nhận:
                </span>
                <span className="text-lg font-bold text-primary">{totalLessons} buổi</span>
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
                            <div className="flex items-center justify-center gap-1 border border-border bg-background rounded-lg px-2 py-1 max-w-[150px] mx-auto focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                              <input 
                                type="number" 
                                step="5000"
                                value={item.pricePerLesson} 
                                onChange={(e) => handlePriceChange(String(item.id), Number(e.target.value))} 
                                className="w-full border-none bg-transparent text-xs font-bold text-foreground text-right focus:outline-none" 
                              />
                              <span className="text-[11px] text-muted-foreground font-semibold">đ</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right font-extrabold text-foreground text-sm">
                            {item.totalTuition.toLocaleString("vi-VN")} đ
                          </td>
                          
                          <td className="px-6 py-4 text-center">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => alert(`Đã gửi biên lai học phí tháng ${selectedMonth} tới phụ huynh em ${item.name}.\n- Số buổi đi học: ${item.presentCount}\n- Áp dụng đơn giá: ${item.pricePerLesson.toLocaleString("vi-VN")}đ/buổi\n- Tổng tiền: ${item.totalTuition.toLocaleString("vi-VN")}đ`)}
                            >
                              Gửi thông báo
                            </Button>
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
                <p className="mt-1 text-sm text-muted-foreground">Dán đường liên kết tài liệu từ Google Drive của bạn xuống kho đề chuyên đề dành cho học viên.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 self-start">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" /> Phát hành tài liệu mới
                  </h2>
                  <form onSubmit={handleAddPdf} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Tiêu đề đề thi/Tài liệu:</label>
                      <input 
                        type="text"
                        required
                        value={newPdfTitle}
                        onChange={(e) => setNewPdfTitle(e.target.value)}
                        placeholder="Ví dụ: Đề khảo sát giữa kì 2 Toán 9..."
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

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Đường liên kết Google Drive (Công khai):</label>
                      <input 
                        type="url"
                        required
                        value={newPdfDriveUrl}
                        onChange={(e) => setNewPdfDriveUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/..."
                        className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary placeholder-muted-foreground/60"
                      />
                      <span className="text-[10px] text-muted-foreground/80 block leading-tight">
                        💡 Lưu ý: Hãy chắc chắn bạn đã chuyển quyền truy cập của file Drive thành &quot;Bất kỳ ai có đường liên kết cũng xem được&quot;.
                      </span>
                    </div>

                    <Button type="submit" className="w-full gap-1.5 py-2">
                      <PlusCircle className="h-4 w-4" /> Phát hành lên hệ thống
                    </Button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Danh sách đề đang hiển thị trên hệ thống học sinh</h2>
                  <div className="space-y-2.5">
                    {pdfList.map((pdf) => (
                      <div key={pdf.id} className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between text-sm">
                        <div className="flex gap-3 items-center min-w-0 flex-1 mr-4">
                          <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="font-semibold text-foreground truncate">{pdf.title}</h4>
                            <div className="flex items-center gap-3 text-muted-foreground text-xs flex-wrap">
                              <span className="text-primary font-medium">{pdf.category}</span>
                              <span>• Khối Lớp {pdf.grade}</span>
                              <span>• Nguồn: Google Drive</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <a 
                            href={pdf.driveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary rounded-lg transition-colors border border-transparent hover:border-border"
                            title="Xem trên Drive"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button 
                            type="button"
                            onClick={() => {
                              if(confirm("Bạn có chắc muốn gỡ file tài liệu này xuống khỏi kho đề học sinh không?")) {
                                setPdfList(prev => prev.filter(p => p.id !== pdf.id))
                              }
                            }}
                            className="p-2 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                            title="Xóa tài liệu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
        <p className="mt-1 text-sm text-muted-foreground">Mức độ thành thạo trung bình của toàn lớp theo từng chủ đề kiến thức.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-foreground">Mức độ thành thạo theo chủ đề</h2>
        <div className="space-y-5">
          {CLASS_MASTERY.map((m) => {
            const label = m.percent >= 75 ? "Tốt" : m.percent >= 60 ? "Trung bình" : "Cần cải thiện"
            const tone = m.percent >= 75 ? "bg-emerald-500" : m.percent >= 60 ? "bg-primary" : "bg-amber-500"
            const labelTone = m.percent >= 75 ? "text-emerald-600" : m.percent >= 60 ? "text-primary" : "text-amber-600"
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
