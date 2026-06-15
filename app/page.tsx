"use client"

import { useState } from "react"
import { AuthGate } from "@/components/auth-gate"
import { StudentPortal } from "@/components/student/student-portal"
import { TeacherPortal } from "@/components/teacher/teacher-portal"
import type { Role } from "@/lib/types"

interface Session {
  role: Role
  name: string
}

export default function Page() {
  const [session, setSession] = useState<Session | null>(null)

  if (!session) {
    return <AuthGate onLogin={(role, name) => setSession({ role, name })} />
  }

  if (session.role === "student") {
    return <StudentPortal userName={session.name} onLogout={() => setSession(null)} />
  }

  return <TeacherPortal userName={session.name} onLogout={() => setSession(null)} />
}
