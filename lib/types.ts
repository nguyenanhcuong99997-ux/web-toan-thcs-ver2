export type Role = "student" | "teacher"

export type GradeId = 6 | 7 | 8 | 9

export type Difficulty = "Nhận biết" | "Thông hiểu" | "Vận dụng" | "Vận dụng cao"

export interface Topic {
  id: string
  name: string
  category: string
  questionCount: number
}

export interface Grade {
  id: GradeId
  label: string
  description: string
  topics: Topic[]
}

export interface Question {
  id: string
  gradeId: GradeId
  topicId: string
  difficulty: Difficulty
  prompt: string
  promptLatex?: string
  options: { key: "A" | "B" | "C" | "D"; text: string; latex?: string }[]
  correct: "A" | "B" | "C" | "D"
  solution: string
  solutionLatex?: string
}

export interface Submission {
  id: string
  title: string
  gradeId: GradeId
  correct: number
  total: number
  score: number
  duration: string
  date: string
}

export interface TopicMastery {
  topic: string
  percent: number
}

export interface Student {
  id: string
  name: string
  email: string
  gradeId: GradeId
  testsTaken: number
  avgScore: number
  active: boolean
  lastActive: string
  submissions: Submission[]
  mastery: TopicMastery[]
}

export interface Badge {
  id: string
  name: string
  description: string
  unlocked: boolean
}
