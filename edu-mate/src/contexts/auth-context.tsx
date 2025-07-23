import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "../types/api"
import { jwtDecode } from "jwt-decode"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token")
    if (storedToken) {
      setToken(storedToken)
      try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(storedToken)
          // @ts-expect-error: Suppressing status type mismatch temporarily
        const userObj: User = {
          id: decoded.sub,
          role: decoded.role,
          name: decoded.name || "User", // fallback if name isn't included in JWT
        }
        setUser(userObj)
        localStorage.setItem("user", JSON.stringify(userObj))
      } catch (err) {
        console.error("Failed to decode token", err)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(newToken)
        // @ts-expect-error: Suppressing status type mismatch temporarily
      const userObj: User = {
        id: decoded.sub,
        role: decoded.role,
        name: decoded.name || "User",
      }
      setToken(newToken)
      setUser(userObj)
      localStorage.setItem("access_token", newToken)
      localStorage.setItem("user", JSON.stringify(userObj))
      console.log("AuthContext: login called, user state updated:", userObj)
    } catch (err) {
      console.error("Invalid token during login", err)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    console.log("AuthContext: logout called")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
