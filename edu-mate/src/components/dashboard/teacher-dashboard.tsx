"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { teacherAPI, leaveAPI, attendanceAPI } from "../../lib/api"
import type { Mark, LeaveApplication, AttendanceRecord } from "../../types/api"
import { BookOpen, Users, FileText, UserCheck } from "lucide-react"

export function TeacherDashboard() {
  const [marks, setMarks] = useState<Mark[]>([])
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [markForm, setMarkForm] = useState({
    student_id: "",
    subject: "",
    score: "",
    remark: "",
  })
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { student_id: "1", student_name: "John Doe", status: "present" },
    { student_id: "2", student_name: "Jane Smith", status: "present" },
  ])

  useEffect(() => {
    loadTeacherData()
  }, [])

  const loadTeacherData = async () => {
    try {
      const [marksData, leaveData] = await Promise.all([teacherAPI.getMarks(), leaveAPI.viewAllApplications()])
      setMarks(marksData)
      setLeaveApplications(leaveData)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("Error loading data: Failed to load teacher information.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadMarks = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      await teacherAPI.uploadMarks({
        student_id: markForm.student_id,
        subject: markForm.subject,
        score: Number(markForm.score),
        remark: markForm.remark,
      })
      setMessage("✅ Marks uploaded successfully.")
      setMarkForm({ student_id: "", subject: "", score: "", remark: "" })
      loadTeacherData()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("❌ Failed to upload marks.")
    }
  }

  const handleMarkAttendance = async () => {
    try {
      await attendanceAPI.markAttendance({ records: attendanceRecords })
      setMessage("✅ Attendance marked successfully.")
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("❌ Failed to mark attendance.")
    }
  }

  const updateAttendanceStatus = (studentId: string, status: "present" | "absent") => {
    setAttendanceRecords((prev) => prev.map((rec) => (rec.student_id === studentId ? { ...rec, status } : rec)))
  }

  const handleLeaveStatusUpdate = async (leaveId: string, status: "approved" | "rejected") => {
    try {
      await leaveAPI.updateStatus(leaveId, { status })
      setMessage(`✅ Leave application ${status}.`)
      loadTeacherData()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("❌ Failed to update leave status.")
    }
  }

  const dashboardStats = [
    { label: "Total Marks Given", count: marks.length, icon: BookOpen },
    { label: "Leave Applications", count: leaveApplications.length, icon: FileText },
    { label: "Students", count: attendanceRecords.length, icon: Users },
    { label: "Attendance", count: "Today", icon: UserCheck },
  ]

  const markFormFields = [
    { id: "student_id", label: "Student ID", type: "text" },
    { id: "subject", label: "Subject", type: "text" },
    { id: "score", label: "Score", type: "number" },
    { id: "remark", label: "Remark", type: "text" },
  ]

  if (isLoading) {
    return <div className="text-center py-20 text-gray-300">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`text-center p-3 rounded-md text-sm font-medium ${message.includes("❌") ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}
        >
          {message}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, idx) => (
          <div key={idx} className={`rounded-xl p-5 shadow-lg flex items-center justify-between bg-dashboard-card-bg`}>
            <div>
              <div className="text-sm font-medium text-gray-400">{stat.label}</div>
              <div className="text-2xl font-bold mt-1 text-primary-text">{stat.count}</div>
            </div>
            
            <div className="text-3xl text-gray-500"><stat.icon /></div>
          </div>
        ))}
      </div>

      {/* Upload Marks */}
      <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-primary-text">Upload Marks</h2>
        <form onSubmit={handleUploadMarks} className="grid gap-4 md:grid-cols-2">
          {markFormFields.map(({ id, label, type }) => (
            <div key={id}>
              <label htmlFor={id} className="text-sm font-medium text-gray-300 block mb-1">
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={markForm[id as keyof typeof markForm]}
                onChange={(e) => setMarkForm({ ...markForm, [id]: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
              />
            </div>
          ))}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start text-button-text-light px-4 py-2 rounded-md shadow-sm transition focus:ring-accent-orange"
            >
              Submit Marks
            </button>
          </div>
        </form>
      </div>

      {/* Marks Given */}
      <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-primary-text">Marks Given</h2>
          <p className="text-gray-400">Marks you have assigned to students</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Student ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Student Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Subject
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Remark
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {marks.map((mark, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">{mark.student_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">{mark.student_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">{mark.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">{mark.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">{mark.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Marking */}
      <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-primary-text">Mark Attendance</h2>
          <p className="text-gray-400">Mark attendance for today's class</p>
        </div>
        <div>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Student Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {attendanceRecords.map((record) => (
                    <tr key={record.student_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">{record.student_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            record.status === "present" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="space-x-2">
                          <button
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm ${record.status === "present" ? "bg-gradient-to-r from-button-gradient-start to-button-gradient-end text-button-text-light hover:from-button-gradient-end hover:to-button-gradient-start" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                            onClick={() => updateAttendanceStatus(record.student_id, "present")}
                          >
                            Present
                          </button>
                          <button
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm ${record.status === "absent" ? "bg-red-900 text-red-300 hover:bg-red-800" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                            onClick={() => updateAttendanceStatus(record.student_id, "absent")}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleMarkAttendance}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-button-text-light bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Leave Applications */}
      <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-primary-text">Leave Applications</h2>
          <p className="text-gray-400">Review and approve/reject student leave requests</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Reason
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {leaveApplications.map((application) => (
                <tr key={application.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">{application.student_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">{application.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        application.status === "approved"
                          ? "bg-green-900 text-green-300"
                          : application.status === "rejected"
                            ? "bg-red-900 text-red-300"
                            : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">
                    {new Date(application.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {application.status === "pending" && (
                      <div className="space-x-2">
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-button-text-light bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
                          onClick={() => handleLeaveStatusUpdate(application.id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-button-text-light bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
                          onClick={() => handleLeaveStatusUpdate(application.id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
