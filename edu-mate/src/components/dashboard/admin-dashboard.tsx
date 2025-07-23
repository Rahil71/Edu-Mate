"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { adminAPI, noticeAPI, textToSqlAPI } from "../../lib/api"
import type { Batch, Mark, Fee, Notice } from "../../types/api"
import { Users, BookOpen, CreditCard, FileText } from 'lucide-react'

export function AdminDashboard() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [marks, setMarks] = useState<Mark[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fees] = useState<Fee[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("batches")

  // Form states
  const [batchForm, setBatchForm] = useState({ name: "" })
  const [assignBatchForm, setAssignBatchForm] = useState({
    batch_name: "",
    student_ids: "",
    students_names: "",
  })
  const [assignTeacherForm, setAssignTeacherForm] = useState({
    batch_name: "",
    teacher_name: "",
  })
  const [passwordResetForm, setPasswordResetForm] = useState({
    user_name: "",
    user_email: "",
    new_passsword: "",
  })
  const [feeForm, setFeeForm] = useState({
    student_id: "",
    academic_yr: "",
    amount: "",
    status: "pending" as "paid" | "pending" | "overdue",
  })
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    message: "",
  })
   const [sqlQuery, setSqlQuery] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sqlResult, setSqlResult] = useState<any>(null)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      const [batchesData, marksData, noticesData] = await Promise.all([
        adminAPI.getAllBatches(),
        adminAPI.getAllMarks(),
        noticeAPI.getAllNotices(),
      ])

      setBatches(batchesData)
      setMarks(marksData)
      setNotices(noticesData)
    } catch (error: unknown) {
      console.error(error);
      setMessage("Error loading data: Failed to load admin information.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      await adminAPI.createBatch(batchForm)
      setMessage("Batch created successfully.")
      setBatchForm({ name: "" })
      loadAdminData()
    } catch (error: unknown) {
      console.error(error);
      setMessage("Error: Failed to create batch.")
    }
  }

  const handleAssignBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      await adminAPI.assignBatch({
        batch_name: assignBatchForm.batch_name,
        student_ids: assignBatchForm.student_ids.split(",").map((id) => id.trim()),
        students_names: assignBatchForm.students_names.split(",").map((name) => name.trim()),
      })
      setMessage("Batch assigned successfully.")
      setAssignBatchForm({ batch_name: "", student_ids: "", students_names: "" })
    } catch (error: unknown) {
      console.error(error);
      setMessage("Error: Failed to assign batch.")
    }
  }

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      await adminAPI.assignBatchTeacher(assignTeacherForm)
      setMessage("Teacher assigned successfully.")
      setAssignTeacherForm({ batch_name: "", teacher_name: "" })
    } catch (error: unknown) {
      console.error(error);
      setMessage("Error: Failed to assign teacher.")
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      await adminAPI.forcePasswordReset(passwordResetForm)
      setMessage("Password reset successfully.")
      setPasswordResetForm({ user_name: "", user_email: "", new_passsword: "" })
    } catch (error: unknown) {
      console.error(error);
      setMessage("Error: Failed to reset password.")
    }
  }

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      await adminAPI.createFeeOne({
        student_id: feeForm.student_id,
        academic_yr: feeForm.academic_yr,
        amount: Number(feeForm.amount),
        status: feeForm.status,
        is_enabled: true,
      })
      setMessage("Fee created successfully.")
      setFeeForm({ student_id: "", academic_yr: "", amount: "", status: "pending" })
    } catch (error: unknown) {
      console.error(error);
      setMessage("Error: Failed to create fee.")
    }
  }

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      await noticeAPI.postNotice(noticeForm)
      setMessage("Notice posted successfully.")
      setNoticeForm({ title: "", message: "" })
      loadAdminData()
    } catch (error: unknown) {
      console.error(error);
      setMessage("Error: Failed to post notice.")
    }
  }

  const handleTextToSQL = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      const result = await textToSqlAPI.generateSQL({ query: sqlQuery })
      setSqlResult(result)
      setMessage("SQL generated successfully.")
    } catch (error: unknown) {
      console.error(error);
      setMessage("Error: Failed to generate SQL.")
    }
  }

  const dashboardStats = [
    { label: "Total Batches", count: batches.length, icon: Users },
    { label: "Total Marks", count: marks.length, icon: BookOpen },
    { label: "Fee Records", count: fees.length, icon: CreditCard },
    { label: "Notices", count: notices.length, icon: FileText },
  ]

  const createBatchFields = [
    { id: "name", label: "Batch Name", type: "text", value: batchForm.name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setBatchForm({ name: e.target.value }) },
  ]

  const assignBatchFields = [
    { id: "batch_name", label: "Batch Name", type: "text", value: assignBatchForm.batch_name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAssignBatchForm({ ...assignBatchForm, batch_name: e.target.value }) },
    { id: "student_ids", label: "Student IDs (comma-separated)", type: "text", value: assignBatchForm.student_ids, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAssignBatchForm({ ...assignBatchForm, student_ids: e.target.value }) },
    { id: "students_names", label: "Student Names (comma-separated)", type: "text", value: assignBatchForm.students_names, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAssignBatchForm({ ...assignBatchForm, students_names: e.target.value }) },
  ]

  const assignTeacherFields = [
    { id: "batch_name", label: "Batch Name", type: "text", value: assignTeacherForm.batch_name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAssignTeacherForm({ ...assignTeacherForm, batch_name: e.target.value }) },
    { id: "teacher_name", label: "Teacher Name", type: "text", value: assignTeacherForm.teacher_name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAssignTeacherForm({ ...assignTeacherForm, teacher_name: e.target.value }) },
  ]

  const passwordResetFields = [
    { id: "user_name", label: "Username", type: "text", value: passwordResetForm.user_name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPasswordResetForm({ ...passwordResetForm, user_name: e.target.value }) },
    { id: "user_email", label: "Email", type: "email", value: passwordResetForm.user_email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPasswordResetForm({ ...passwordResetForm, user_email: e.target.value }) },
    { id: "new_passsword", label: "New Password", type: "password", value: passwordResetForm.new_passsword, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPasswordResetForm({ ...passwordResetForm, new_passsword: e.target.value }) },
  ]

  const createFeeFields = [
    { id: "student_id", label: "Student ID", type: "text", value: feeForm.student_id, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFeeForm({ ...feeForm, student_id: e.target.value }) },
    { id: "academic_yr", label: "Academic Year", type: "text", value: feeForm.academic_yr, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFeeForm({ ...feeForm, academic_yr: e.target.value }) },
    { id: "amount", label: "Amount", type: "number", value: feeForm.amount, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFeeForm({ ...feeForm, amount: e.target.value }) },
  ]

  const postNoticeFields = [
    { id: "title", label: "Title", type: "text", value: noticeForm.title, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNoticeForm({ ...noticeForm, title: e.target.value }) },
    { id: "message", label: "Message", type: "text", value: noticeForm.message, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNoticeForm({ ...noticeForm, message: e.target.value }) },
  ]

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-gray-300">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-md text-sm text-center ${message.includes("Error") ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}
        >
          {message}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-400">{stat.label}</h3>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold text-primary-text">{stat.count}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
  <div className="flex flex-wrap md:flex-nowrap overflow-x-auto border-b border-gray-700 scrollbar-hide">
    {[
      { id: "batches", label: "Batch Management" },
      { id: "fees", label: "Fee Management" },
      { id: "marks", label: "Marks Overview" },
      { id: "notices", label: "Notices" },
      { id: "tools", label: "Admin Tools" },
    ].map((tab) => (
      <button
        key={tab.id}
        className={`flex-shrink-0 py-2 px-4 text-sm font-medium whitespace-nowrap ${
          activeTab === tab.id
            ? "border-b-2 border-accent-orange text-accent-orange"
            : "text-gray-400 hover:text-primary-text"
        }`}
        onClick={() => setActiveTab(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>

        {activeTab === "batches" && (
          <div className="space-y-4 fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Create Batch */}
              <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-primary-text">Create Batch</h2>
                <div>
                  <form onSubmit={handleCreateBatch} className="space-y-4">
                    {createBatchFields.map((field) => (
                      <div className="space-y-2" key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-300">
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={field.value}
                          onChange={field.onChange}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                        />
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-button-text-light bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
                    >
                      Create Batch
                    </button>
                  </form>
                </div>
              </div>

              {/* Assign Batch to Students */}
              <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-primary-text">Assign Batch to Students</h2>
                <div>
                  <form onSubmit={handleAssignBatch} className="space-y-4">
                    {assignBatchFields.map((field) => (
                      <div className="space-y-2" key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-300">
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={field.value}
                          onChange={field.onChange}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                        />
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-button-text-light bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
                    >
                      Assign Batch
                    </button>
                  </form>
                </div>
              </div>

              {/* Assign Teacher to Batch */}
              <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-primary-text">Assign Teacher to Batch</h2>
                <div>
                  <form onSubmit={handleAssignTeacher} className="space-y-4">
                    {assignTeacherFields.map((field) => (
                      <div className="space-y-2" key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-300">
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={field.value}
                          onChange={field.onChange}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                        />
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-button-text-light bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
                    >
                      Assign Teacher
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Batches Table */}
            <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary-text">All Batches</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Batch Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Students Count
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Teacher
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {batches.map((batch) => (
                      <tr key={batch.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-text">
                          {batch.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {batch.students?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {batch.teacher || "Not assigned"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "fees" && (
          <div className="space-y-4 fade-in">
            <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary-text">Create Fee Record</h2>
              <div>
                <form onSubmit={handleCreateFee} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {createFeeFields.map((field) => (
                      <div className="space-y-2" key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-300">
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={field.value}
                          onChange={field.onChange}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <label htmlFor="fee-status" className="block text-sm font-medium text-gray-300">
                        Status
                      </label>
                      <select
                        id="fee-status"
                        value={feeForm.status}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e) => setFeeForm({ ...feeForm, status: e.target.value as any })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-button-text-light bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
                  >
                    Create Fee Record
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "marks" && (
          <div className="space-y-4 fade-in">
            <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-primary-text">All Marks</h2>
                <p className="text-gray-400">Overview of all marks in the system</p>
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
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Teacher
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">{mark.teacher_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notices" && (
          <div className="space-y-4 fade-in">
            <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary-text">Post Notice</h2>
              <div>
                <form onSubmit={handlePostNotice} className="space-y-4">
                  {postNoticeFields.map((field) => (
                    <div className="space-y-2" key={field.id}>
                      <label htmlFor={field.id} className="block text-sm font-medium text-gray-300">
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        value={field.value}
                        onChange={field.onChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-button-text-light bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
                  >
                    Post Notice
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary-text">All Notices</h2>
              <div>
                <div className="space-y-4">
                  {notices.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No notices available</p>
                  ) : (
                    notices.map((notice) => (
                      <div key={notice.id} className="border border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-lg text-primary-text">{notice.title}</h3>
                        <p className="text-gray-400">{notice.message}</p>
                        <p className="text-sm text-gray-400 mt-2">{new Date(notice.created_at).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tools" && (
          <div className="space-y-4 fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Password Reset */}
              <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-primary-text">Force Password Reset</h2>
                <div>
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    {passwordResetFields.map((field) => (
                      <div className="space-y-2" key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-300">
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={field.value}
                          onChange={field.onChange}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                        />
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-button-text-light bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
                    >
                      Reset Password
                    </button>
                  </form>
                </div>
              </div>

              {/* Text to SQL */}
              <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-primary-text">Text to SQL</h2>
                  <p className="text-gray-400">Generate SQL from natural language</p>
                </div>
                <div>
                  <form onSubmit={handleTextToSQL} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="sql-query" className="block text-sm font-medium text-gray-300">
                        Query in plain English
                      </label>
                      <input
                        id="sql-query"
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        placeholder="e.g., Show all students with marks above 80"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-button-text-light bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
                    >
                      Generate SQL
                    </button>
                  </form>
                  {sqlResult && (
                    <div className="mt-4 space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Generated SQL:</label>
                      <pre className="bg-gray-700 p-2 rounded text-sm overflow-x-auto text-primary-text">
                        {sqlResult.sql}
                      </pre>
                      {sqlResult.result && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300">Result:</label>
                          <pre className="bg-gray-700 p-2 rounded text-sm overflow-x-auto text-primary-text">
                            {JSON.stringify(sqlResult.result, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
