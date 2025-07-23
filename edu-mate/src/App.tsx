"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { LandingPage } from "./components/landing-page" // Adjust path accordingly

import { useAuth } from "./contexts/auth-context"
import { LoginForm } from "./components/auth/login-form"
import { RegisterForm } from "./components/auth/register-form"
import { StudentDashboard } from "./components/dashboard/student-dashboard"
import { TeacherDashboard } from "./components/dashboard/teacher-dashboard"
import { AdminDashboard } from "./components/dashboard/admin-dashboard"
import { Navbar } from "./components/layout/navbar"
import { NoticeBoard } from "./components/shared/notice-board"
import { LeaveForm } from "./components/shared/leave-form"
import { TimetableUpload } from "./components/shared/timetable-upload"

// ─────────────────────────────────────────────
// 🔒 Private Route to protect dashboard
// ─────────────────────────────────────────────
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) navigate("/login")
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-dark text-gray-600">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-primary-text">EduMate</h1>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <>{children}</> : null
}

// ─────────────────────────────────────────────
// 🧭 Dashboard Wrapper with Tabs
// ─────────────────────────────────────────────
const DashboardWrapper: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (!user) return null

  const roleTabs: Record<string, { value: string; label: string }[]> = {
    student: [{ value: "leave", label: "Apply Leave" }],
    teacher: [{ value: "timetable", label: "Upload Timetable" }],
    admin: [{ value: "timetable", label: "Upload Timetable" }],
  }

  const commonTabs = [
    { value: "dashboard", label: "Dashboard" },
    { value: "notices", label: "Notices" },
  ]

  const allTabs = [...commonTabs, ...(roleTabs[user.role] || [])]

  const renderDashboardContent = () => {
    switch (user.role) {
      case "student":
        return <StudentDashboard />
      case "teacher":
        return <TeacherDashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return <div>Invalid user role</div>
    }
  }

  return (
    <div className="min-h-screen bg-background-dark text-primary-text">
      <Navbar />
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary-text">Welcome, {user.name}</h1>
          <p className="text-gray-400 capitalize">{user.role} Dashboard</p>
        </div>

        <div className="space-y-4">
          <div className="flex border-b border-gray-700 overflow-x-auto whitespace-nowrap">
            {allTabs.map((tab) => (
              <button
                key={tab.value}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === tab.value
                    ? "border-b-2 border-accent-orange text-accent-orange"
                    : "text-gray-400 hover:text-primary-text"
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "dashboard" && <div className="fade-in">{renderDashboardContent()}</div>}
          {activeTab === "notices" && (
            <div className="fade-in">
              <NoticeBoard />
            </div>
          )}
          {user.role === "student" && activeTab === "leave" && (
            <div className="flex justify-center fade-in">
              <LeaveForm />
            </div>
          )}
          {(user.role === "teacher" || user.role === "admin") && activeTab === "timetable" && (
            <div className="fade-in">
              <TimetableUpload />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 📱 App Router
// ─────────────────────────────────────────────
const App: React.FC = () => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && user && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/dashboard")
    }
  }, [user, isLoading, navigate, location.pathname])

  if (isLoading && location.pathname === "/") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-primary-text">EduMate</h1>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardWrapper />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
