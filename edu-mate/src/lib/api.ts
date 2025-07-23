/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  Mark,
  Batch,
  Fee,
  Notice,
  AttendanceRecord,
  LeaveApplication,
  TimetableEntry,
} from "./../types/api"

const API_BASE_URL = "https://edu-mate-x34a.onrender.com"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Add Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor: Log errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

// ------------------ AUTH ------------------

export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post("/auth/register", data)
    return res.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", data)
    return res.data
  },
}

// ------------------ STUDENT ------------------

export const studentAPI = {
  getMarks: (): Promise<Mark[]> => api.get("/student/get_marks").then((res) => res.data),
  checkFeesStatus: (): Promise<any> => api.get("/student/check_fees_status").then((res) => res.data),
  getTimetable: (): Promise<any> => api.get("/student/get_timetable").then((res) => res.data),
}

// ------------------ TEACHER ------------------

export const teacherAPI = {
  uploadMarks: (data: Omit<Mark, "id">): Promise<any> =>
    api.post("/teacher/upload-marks", data).then((res) => res.data),
  getMarks: (): Promise<Mark[]> => api.get("/teacher/get_marks").then((res) => res.data),
}

// ------------------ ADMIN ------------------

export const adminAPI = {
  createBatch: (data: { name: string }): Promise<any> =>
    api.post("/admin/create_batch", data).then((res) => res.data),

  assignBatch: (data: { batch_name: string; student_ids: string[]; students_names: string[] }): Promise<any> =>
    api.post("/admin/assign_batch", data).then((res) => res.data),

  assignBatchTeacher: (data: { batch_name: string; teacher_name: string }): Promise<any> =>
    api.post("/admin/assign_batch_teacher", data).then((res) => res.data),

  getAllBatches: (): Promise<Batch[]> => api.get("/admin/all_batches").then((res) => res.data),

  getTeacherBatches: (): Promise<any> => api.get("/admin/teacher_batches").then((res) => res.data),

  getAllMarks: (): Promise<Mark[]> => api.get("/admin/get_marks").then((res) => res.data),

  forcePasswordReset: (data: { user_name: string; user_email: string; new_passsword: string }): Promise<any> =>
    api.post("/admin/force-reset", data).then((res) => res.data),

  createFeeOne: (data: Partial<Fee>): Promise<any> => api.post("/admin/create_fee_one", data).then((res) => res.data),

  createBulkFee: (data: any): Promise<any> => api.post("/admin/create_bulk_fee", data).then((res) => res.data),

  updateFee: (data: Partial<Fee>): Promise<any> => api.put("/admin/update_fee", data).then((res) => res.data),

  toggleFees: (data: any): Promise<any> => api.post("/admin/toggle_fees", data).then((res) => res.data),

  getStudentsInAllBatch: (): Promise<any> => api.get("/admin/student_in_all_batch").then((res) => res.data),

  getStudentsInSpecificBatch: (data: { batch_name: string }): Promise<any> =>
    api.post("/admin/student_in_specifc_batch", data).then((res) => res.data),
}

// ------------------ TIMETABLE ------------------

export const timetableAPI = {
  uploadPDF: (formData: FormData): Promise<any> =>
    api
      .post("/timetable/upload_timetable_pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  uploadStructured: (data: { batch_id: string; entries: TimetableEntry[] }): Promise<any> =>
    api.post("/timetable/upload_structured_timetable", data).then((res) => res.data),
}

// ------------------ NOTICE ------------------

export const noticeAPI = {
  postNotice: (data: { title: string; message: string }): Promise<any> =>
    api.post("/notice/post_notice", data).then((res) => res.data),

  getAllNotices: (): Promise<Notice[]> =>
    api.get("/notice/get_all_notices").then((res) => res.data.notices), // 🛠️ important: extract `notices` key
}

// ------------------ ATTENDANCE ------------------

export const attendanceAPI = {
  markAttendance: (data: { records: AttendanceRecord[] }): Promise<any> =>
    api.post("/attendace/mark_attendance", data).then((res) => res.data),

  viewAttendance: (): Promise<any> =>
    api.get("/attendace/view_attendance").then((res) => res.data.attendance), // 🛠️ extract `attendance` key
}

// ------------------ LEAVE ------------------

export const leaveAPI = {
  apply: (data: { reason: string }): Promise<any> => api.post("/leave/apply", data).then((res) => res.data),

  viewAllApplications: (): Promise<LeaveApplication[]> =>
    api.get("/leave/view_all_applications").then((res) => res.data),

  updateStatus: (leaveId: string, data: { status: "approved" | "rejected" }): Promise<any> =>
    api.put(`/leave/update_application_status/${leaveId}`, data).then((res) => res.data),
}

// ------------------ TEXT TO SQL ------------------

export const textToSqlAPI = {
  generateSQL: (data: { query: string }): Promise<any> =>
    api.post("/text_to_sql", data).then((res) => res.data),
}
