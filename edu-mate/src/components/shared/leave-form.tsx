"use client"

import type React from "react"
import { useState } from "react"
import { leaveAPI } from "../../lib/api"

export function LeaveForm() {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      await leaveAPI.apply({ reason })
      setMessage("✅ Leave application submitted successfully.")
      setReason("")
    } catch {
      setMessage("❌ Failed to submit leave application.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-dashboard-card-bg p-6 rounded-lg shadow-lg space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary-text">Apply for Leave</h2>
        <p className="text-gray-400 text-sm">Submit your leave application for approval</p>
      </div>

      {message && (
        <div
          className={`text-sm text-center font-medium p-3 rounded-md ${
            message.includes("❌") ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-300">
            Reason for Leave <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g., Medical emergency, personal work, etc."
            required
            rows={5}
            className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-accent-orange focus:border-accent-orange text-sm bg-gray-700 text-primary-text"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start text-button-text-light text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  )
}
