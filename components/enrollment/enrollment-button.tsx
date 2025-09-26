"use client"
import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { coursesAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle } from "lucide-react"

interface EnrollmentButtonProps {
  courseId: string
  className?: string
  size?: "sm" | "default" | "lg"
}

export function EnrollmentButton({ courseId, className, size = "default" }: EnrollmentButtonProps) {
  const { state, dispatch } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)

  const enrollment = state.enrollments.find((e) => e.courseId === courseId && e.userId === state.currentUser?.id)

  const course = state.courses.find((c) => c.id === courseId)

  const handleEnroll = async () => {
    if (!state.currentUser || !course) return

    setIsLoading(true)
    try {
      // Call real API
      const response = await coursesAPI.enroll(courseId)
      const { enrollment } = response.data

      dispatch({ type: "ADD_ENROLLMENT", payload: enrollment })
    } catch (error) {
      console.error("Enrollment failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!state.currentUser) {
    return (
      <Button variant="outline" disabled className={className} size={size}>
        Login to Enroll
      </Button>
    )
  }

  if (enrollment) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center space-x-2">
          <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>
            {enrollment.status === "completed" ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Completed
              </>
            ) : (
              <>
                <BookOpen className="mr-1 h-3 w-3" />
                Enrolled
              </>
            )}
          </Badge>
          <span className="text-sm text-muted-foreground">{enrollment.progress}%</span>
        </div>
        {enrollment.status !== "completed" && <Progress value={enrollment.progress} className="w-full" />}
      </div>
    )
  }

  return (
    <Button onClick={handleEnroll} disabled={isLoading} className={className} size={size}>
      {isLoading ? "Enrolling..." : "Enroll Now"}
    </Button>
  )
}
