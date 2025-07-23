"use client"

import { useState, useEffect } from "react"
import { noticeAPI } from "../../lib/api"
import type { Notice } from "../../types/api"
import { Bell } from "lucide-react"

export function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = async () => {
    try {
      const data = await noticeAPI.getAllNotices()
      setNotices(data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("❌ Failed to load notices.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-32 text-gray-500">Loading notices...</div>
  }

  return (
    <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-md space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-primary-text">
          <Bell className="h-6 w-6 text-accent-orange" />
          Notice Board
        </h2>
        <p className="text-gray-400">Stay updated with the latest announcements</p>
      </div>

      {/* Error Message */}
      {message && (
        <div className="text-center bg-red-900 text-red-300 p-3 rounded-md text-sm font-medium">{message}</div>
      )}

      {/* Notices */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No notices available</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="border-l-4 border-accent-orange bg-gray-700 p-4 rounded-md shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg text-primary-text">{notice.title}</h3>
              <p className="text-gray-300">{notice.message}</p>
              <p className="text-xs text-gray-400 mt-1">Posted on {new Date(notice.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
