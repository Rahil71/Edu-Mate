// ─────────────────────────────────────────────
// ✅ USER TYPES
// ─────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
  // avatarUrl?: string // Optional for future UI
}

// ─────────────────────────────────────────────
// ✅ AUTH TYPES
// ─────────────────────────────────────────────
export interface AuthResponse {
  access_token: string
  user?: User
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: "student" | "teacher" | "admin"
}

export interface LoginRequest {
  email: string
  password: string
}

// ─────────────────────────────────────────────
// ✅ MARKS TYPES
// ─────────────────────────────────────────────
export interface Mark {
  id?: string
  student_id: string
  student_name?: string
  subject: string
  score: number
  remark: string
  teacher_name?: string
}

// ─────────────────────────────────────────────
// ✅ BATCH TYPES
// ─────────────────────────────────────────────
export interface Batch {
  id: string
  name: string
  students?: string[] // Student IDs
  teacher?: string    // Teacher ID
}

// ─────────────────────────────────────────────
// ✅ FEE TYPES
// ─────────────────────────────────────────────
export interface Fee {
  id: string
  student_id: string
  academic_yr: string
  amount: number
  status: "paid" | "pending" | "overdue"
  is_enabled: boolean
}

// ─────────────────────────────────────────────
// ✅ NOTICE TYPES
// ─────────────────────────────────────────────
export interface Notice {
  id: string
  title: string
  message: string
  created_at: string // ISO string
}

// ─────────────────────────────────────────────
// ✅ ATTENDANCE TYPES
// ─────────────────────────────────────────────
export interface AttendanceRecord {
  student_id: string
  student_name?: string
  status: "present" | "absent"
}

// ─────────────────────────────────────────────
// ✅ LEAVE TYPES
// ─────────────────────────────────────────────
export interface LeaveApplication {
  id: string
  student_id: string
  student_name?: string
  reason: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

// ─────────────────────────────────────────────
// ✅ TIMETABLE TYPES
// ─────────────────────────────────────────────
export interface TimetableEntry {
  subject: string
  date: string     // ISO date: YYYY-MM-DD
  time: string     // Format: HH:mm (24hr)
}
