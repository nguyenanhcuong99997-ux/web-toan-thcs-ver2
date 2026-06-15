"use client"

import { useState } from "react"
import { GraduationCap, Users, User, Lock, Sigma, ShieldCheck, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Role } from "@/lib/types"

// 1. Định nghĩa danh sách tài khoản hợp lệ cố định trên hệ thống (Sử dụng ID và mật khẩu do bạn cấp)
const VALID_USERS = [
  // Tài khoản Giáo viên mặc định
  { userId: "truemath", password: "888888", name: "Thầy Nguyễn Anh Cường", role: "teacher" },
  
  // Danh sách tài khoản Học sinh mẫu (Bạn có thể thêm các học sinh khác vào đây)
  { userId: "truemath_hocsinh9", password: "student123", name: "Nguyễn Minh Anh", role: "student" },
  { userId: "truemath_hocsinh8", password: "student123", name: "Trần Văn Bình", role: "student" },
]

interface AuthGateProps {
  onLogin: (role: Role, name: string) => void
}

export function AuthGate({ onLogin }: AuthGateProps) {
  const [role, setRole] = useState<Role>("student")
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ userId?: string; password?: string; auth?: string }>({})

  function validate() {
    const next: typeof errors = {}
    const cleanId = userId.trim().toLowerCase()

    if (!cleanId) {
      next.userId = "Vui lòng nhập ID đăng nhập."
    } else if (role === "student" && !cleanId.startsWith("truemath_")) {
      // Bắt buộc học sinh phải nhập đúng định dạng cấu pháp Truemath_*****
      next.userId = "ID học sinh hợp lệ phải bắt đầu bằng cụm 'Truemath_'"
    }

    if (!password) {
      next.password = "Vui lòng nhập mật khẩu."
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const cleanId = userId.trim().toLowerCase()

    // --- XỬ LÝ ĐĂNG NHẬP BẰNG ID ---
    // So khớp chính xác ID (không phân biệt hoa thường), Mật khẩu và Vai trò đã chọn
    const userFound = VALID_USERS.find(
      (u) => u.userId.toLowerCase() === cleanId && u.password === password && u.role === role
    )

    if (userFound) {
      // Đăng nhập đúng thông tin -> Cho phép vào hệ thống
      onLogin(userFound.role as Role, userFound.name)
    } else {
      // Sai thông tin -> Hiện thông báo chặn lại công khai
      setErrors({
        auth: "Mã ID đăng nhập hoặc mật khẩu không chính xác cho vai trò này. Vui lòng kiểm tra lại!"
      })
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sigma className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">TrueMath Toán THCS</p>
            <p className="text-sm text-sidebar-foreground/60">Hệ thống Ôn thi &amp; Quản lý</p>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-balance text-4xl font-bold leading-tight">
            Nền tảng ôn luyện Toán THCS toàn diện cho lớp 6 đến lớp 9
          </h1>
          <p className="text-pretty text-base leading-relaxed text-sidebar-foreground/70">
            Luyện đề thông minh với hệ thống chấm tự động, lời giải chi tiết bằng công thức Toán học,
            theo dõi tiến độ và quản lý lớp học chuyên nghiệp.
          </p>
          <ul className="space-y-3">
            {[
              { icon: Sparkles, text: "Ngân hàng đề bám sát chương trình Bộ GD&amp;ĐT" },
              { icon: ShieldCheck, text: "Chấm điểm tức thì kèm lời giải chi tiết" },
              { icon: Users, text: "Quản lý học viên &amp; theo dõi tiến độ lớp học" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-sidebar-foreground/50">
          © 2026 TrueMath THCS. Bản quyền thuộc về nền tảng giáo dục.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sigma className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold">TrueMath THCS</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Đăng nhập hệ thống</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Chào mừng quay trở lại! Vui lòng chọn vai trò và điền tài khoản ID được cấp.
              </p>
            </div>

            {/* Role tabs */}
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => {
                  setRole("student")
                  setErrors({})
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  role === "student" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <GraduationCap className="h-4 w-4" />
                Học sinh
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("teacher")
                  setErrors({})
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  role === "teacher" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Users className="h-4 w-4" />
                Giáo viên
              </button>
            </div>

            {/* Alert Error Đăng nhập sai */}
            {errors.auth && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs font-semibold text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.auth}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="userId">
                  {role === "teacher" ? "Tài khoản Giáo viên" : "Tài khoản ID Học sinh"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="userId"
                    type="text"
                    placeholder={role === "teacher" ? "Ví dụ: Truemath" : "Cú pháp: Truemath_*****"}
                    className="pl-9"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                {errors.userId && <p className="text-xs text-destructive">{errors.userId}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <button type="button" className="text-xs font-medium text-primary hover:underline">
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Đăng nhập
              </Button>
            </form>
          </div>

          {/* Hộp thông tin tài khoản phục vụ việc kiểm thử hệ thống định dạng ID mới */}
          <div className="mt-4 rounded-xl border border-dashed border-border p-3.5 bg-muted/40 text-[11px] text-muted-foreground space-y-1">
            <p className="font-bold text-foreground">Thông tin đăng nhập hệ thống:</p>
            <p>• Tab <b className="text-primary">Học sinh</b>: Nhập ID dạng <span className="underline">Truemath_hocsinh9</span> (MK: student123)</p>
            <p>• Tab <b className="text-primary">Giáo viên</b>: Nhập ID là <span className="underline">Truemath</span> (MK: 888888)</p>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Lưu ý: Tính năng tạo tài khoản tự do đã đóng. Vui lòng liên hệ Giáo viên để nhận ID cá nhân.
          </p>
        </div>
      </div>
    </div>
  )
}
