"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "student" | "instructor"
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const { state, dispatch } = useApp()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken")

      if (!token) {
        setLoading(false)
        return
      }

      // If user is not in state but token exists, restore user session
      if (!state.user) {
        try {
          // Mock user restoration - replace with real API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          const mockUser = {
            id: "1",
            email: "user@example.com",
            name: "User",
            role: "student" as const,
            avatar: "/placeholder.svg?height=40&width=40",
            createdAt: new Date(),
          }

          dispatch({ type: "SET_USER", payload: mockUser })
        } catch (error) {
          localStorage.removeItem("authToken")
        }
      }

      setLoading(false)
    }

    checkAuth()
  }, [state.user, dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!state.user) {
    if (fallback) {
      return <>{fallback}</>
    }

    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login"
    }
    return null
  }

  if (requiredRole && state.user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
