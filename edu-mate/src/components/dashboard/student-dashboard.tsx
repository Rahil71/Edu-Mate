"use client"

import { useState, useEffect } from "react"
import { studentAPI, attendanceAPI } from "../../lib/api" // Changed import path
import type { Mark } from "../../types/api" // Changed import path
import { BookOpen, CreditCard, Calendar, UserCheck } from "lucide-react"

export function StudentDashboard() {
  const [marks, setMarks] = useState<Mark[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [feesStatus, setFeesStatus] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [timetable, setTimetable] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [attendance, setAttendance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    loadStudentData()
  }, [])

  const loadStudentData = async () => {
    try {
      const [marksData, feesData, timetableData, attendanceData] = await Promise.all([
        studentAPI.getMarks(),
        studentAPI.checkFeesStatus(),
        studentAPI.getTimetable(),
        attendanceAPI.viewAttendance(),
      ])

      setMarks(marksData)
      setFeesStatus(feesData)
      setTimetable(timetableData)
      setAttendance(attendanceData)
    } catch (error: unknown) {
      console.error(error);
      setMessage("Error loading data: Failed to load student information.")
    } finally {
      setIsLoading(false)
    }
  }

  const dashboardStats = [
    { label: "Total Subjects", count: marks.length, icon: BookOpen },
    { label: "Fee Status", count: feesStatus?.status || "Unknown", icon: CreditCard, isStatus: true },
    { label: "Attendance", count: attendance?.percentage || "N/A", icon: UserCheck, isPercentage: true },
    { label: "Timetable", count: timetable ? "Available" : "Not Set", icon: Calendar },
  ]

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-gray-300">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {message && <div className="p-3 bg-red-900 text-red-300 rounded-md text-sm text-center">{message}</div>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-400">{stat.label}</h3>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold text-primary-text">
              {stat.isStatus ? (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${stat.count === "paid" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}
                >
                  {stat.count}
                </span>
              ) : stat.isPercentage ? (
                `${stat.count}%`
              ) : (
                stat.count
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Marks Table */}
      <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-primary-text">My Marks</h2>
          <p className="text-gray-400">Your academic performance across subjects</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-text">{mark.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{mark.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{mark.remark}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{mark.teacher_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timetable */}
      <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-primary-text">Timetable</h2>
          <p className="text-gray-400">Your class schedule</p>
        </div>
        <div>
          {timetable?.type === "pdf" ? (
            <div className="space-y-2">
              <p className="text-gray-400">Timetable is available as PDF</p>
              <a
                href={timetable.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-button-text-light bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
              >
                View/Download Timetable
              </a>
            </div>
          ) : timetable?.entries ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
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
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {timetable.entries.map((entry: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{entry.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{entry.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{entry.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No timetable available</p>
          )}
        </div>
      </div>
    </div>
  )
}
