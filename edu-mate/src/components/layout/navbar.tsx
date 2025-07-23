"use client"

import { useAuth } from "../../contexts/auth-context"
import { useNavigate } from "react-router-dom"
import { LogOut, User } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) return null

  return (
    <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex h-14 items-center px-4">
        {/* Logo */}
        <a href="/dashboard" className="flex items-center space-x-2 mr-auto">
          <span className="text-xl font-bold tracking-tight text-gray-800">EduMate</span>
        </a>

        {/* User Info + Logout */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-800">{user.name}</span>
            <span className="text-xs text-gray-500 capitalize">({user.role})</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gradient-to-r from-button-gradient-start to-button-gradient-end text-white hover:opacity-90 transition"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
