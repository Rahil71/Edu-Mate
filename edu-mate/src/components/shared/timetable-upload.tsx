"use client"

import type React from "react"

import { useState } from "react"
import { timetableAPI } from "../../lib/api"
import { Plus, Trash2 } from "lucide-react"
import type { TimetableEntry } from "../../types/api"

export function TimetableUpload() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [batchId, setBatchId] = useState("")
  const [structuredEntries, setStructuredEntries] = useState<TimetableEntry[]>([{ subject: "", date: "", time: "" }])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("pdf")

  const handlePDFUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pdfFile || !batchId) {
      setMessage("Please select a PDF file and enter a Batch ID.")
      return
    }

    setIsLoading(true)
    setMessage(null)
    const formData = new FormData()
    formData.append("pdf", pdfFile)
    formData.append("batch_id", batchId)

    try {
      await timetableAPI.uploadPDF(formData)
      setMessage("✅ Timetable PDF uploaded successfully.")
      setPdfFile(null)
      setBatchId("")
    } catch {
      setMessage("❌ Failed to upload timetable PDF.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStructuredUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!batchId || structuredEntries.some((entry) => !entry.subject || !entry.date || !entry.time)) {
      setMessage("Please fill all fields for structured timetable entries.")
      return
    }

    setIsLoading(true)
    setMessage(null)
    try {
      await timetableAPI.uploadStructured({ batch_id: batchId, entries: structuredEntries })
      setMessage("✅ Structured timetable uploaded successfully.")
      setBatchId("")
      setStructuredEntries([{ subject: "", date: "", time: "" }])
    } catch {
      setMessage("❌ Failed to upload structured timetable.")
    } finally {
      setIsLoading(false)
    }
  }

  const addEntry = () => {
    setStructuredEntries([...structuredEntries, { subject: "", date: "", time: "" }])
  }

  const removeEntry = (index: number) => {
    setStructuredEntries(structuredEntries.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: keyof TimetableEntry, value: string) => {
    const updated = [...structuredEntries]
    updated[index] = { ...updated[index], [field]: value }
    setStructuredEntries(updated)
  }

  return (
    <div className="bg-dashboard-card-bg p-6 rounded-lg shadow-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary-text">Upload Timetable</h2>
        <p className="text-gray-400">Upload as a PDF or structured entries</p>
      </div>

      {message && (
        <div
          className={`text-sm font-medium text-center p-3 rounded-md ${
            message.includes("❌") ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-700">
        {["pdf", "structured"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "text-accent-orange border-b-2 border-accent-orange"
                : "text-gray-400 hover:text-primary-text"
            }`}
          >
            {tab === "pdf" ? "PDF Upload" : "Structured Data"}
          </button>
        ))}
      </div>

      {/* PDF Upload Form */}
      {activeTab === "pdf" && (
        <form onSubmit={handlePDFUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Batch ID</label>
            <input
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Timetable PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              required
              className="mt-1 block w-full text-sm text-gray-600 file:py-2 file:px-4 file:bg-gray-700 file:text-accent-orange file:rounded-md file:border-0 hover:file:bg-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start text-button-text-light text-sm font-medium py-2 px-4 rounded-md"
          >
            {isLoading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>
      )}

      {/* Structured Upload Form */}
      {activeTab === "structured" && (
        <form onSubmit={handleStructuredUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Batch ID</label>
            <input
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-300">Entries</h3>
              <button
                type="button"
                onClick={addEntry}
                className="inline-flex items-center text-sm text-accent-orange hover:text-orange-400"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Entry
              </button>
            </div>

            {structuredEntries.map((entry, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="text-sm text-gray-300">Subject</label>
                  <input
                    value={entry.subject}
                    onChange={(e) => updateEntry(index, "subject", e.target.value)}
                    required
                    className="block w-full mt-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Date</label>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => updateEntry(index, "date", e.target.value)}
                    required
                    className="block w-full mt-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Time</label>
                  <input
                    type="time"
                    value={entry.time}
                    onChange={(e) => updateEntry(index, "time", e.target.value)}
                    required
                    className="block w-full mt-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-accent-orange focus:border-accent-orange bg-gray-700 text-primary-text"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  disabled={structuredEntries.length === 1}
                  className="col-span-full sm:col-span-1 flex justify-end text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-end hover:to-button-gradient-start text-button-text-light text-sm font-medium py-2 px-4 rounded-md"
          >
            {isLoading ? "Uploading..." : "Upload Structured Timetable"}
          </button>
        </form>
      )}
    </div>
  )
}
