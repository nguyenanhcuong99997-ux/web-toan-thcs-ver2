"use client"

import { useState } from "react"
import { GraduationCap, Users, Mail, Lock, Sigma, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Role } from "@/lib/types"

interface AuthGateProps {
  onLogin: (role: Role, name: string) => void
}

export function AuthGate({ onLogin }: AuthGateProps) {
  const [role, setRole] = useState<Role>("student")
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({})

  function validate() {
    const next: typeof errors = {}
    if (mode === "signup" && name.trim().length < 2) next.name = "Vui lòng nhập họ và tên."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Email không hợp lệ."
    if (password.length < 6) next.password = "Mật khẩu cần ít nhất 6 ký tự."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const displayName =
      mode === "signup" && name.trim()
        ? name.trim()
        : role === "teacher"
          ? "Thầy Nguyễn Anh Cường"
          : "Nguyễn Minh Anh"
    onLogin(role, displayName)
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
            <p className="text-sm text-sidebar-foreground/60">Hệ thống Ôn thi & Quản lý</p>
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
              { icon: Sparkles, text: "Ngân hàng đề bám sát chương trình Bộ GD&ĐT" },
              { icon: ShieldCheck, text: "Chấm điểm tức thì kèm lời giải chi tiết" },
              { icon: Users, text: "Quản lý học viên & theo dõi tiến độ lớp học" },
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
              <h2 className="text-2xl font-bold text-foreground">
                {mode === "login" ? "Đăng nhập hệ thống" : "Tạo tài khoản mới"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Chào mừng quay trở lại! Vui lòng chọn vai trò của bạn."
                  : "Đăng ký để bắt đầu hành trình chinh phục môn Toán."}
              </p>
            </div>

            {/* Role tabs */}
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  role === "student"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <GraduationCap className="h-4 w-4" />
                Học sinh
              </button>
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  role === "teacher"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Users className="h-4 w-4" />
                Giáo viên
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@truong.edu.vn"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Mật khẩu</Label>
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

              {mode === "login" && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm font-medium text-primary hover:underline">
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                {mode === "login" ? "Đăng nhập" : "Đăng ký"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login")
                  setErrors({})
                }}
                className="font-semibold text-primary hover:underline"
              >
                {mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
              </button>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Bằng việc tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.
          </p>
        </div>
      </div>
    </div>
  )
}
