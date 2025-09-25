"use client"
import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DataTable } from "@/components/reusable/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, GraduationCap } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const enrollmentColumns = [
  {
    key: "student",
    label: "Student",
    render: (enrollment: any, onEdit: any, onDelete: any, context: any) => {
      const user = context.users.find((u: any) => u.id === enrollment.userId)
      return (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{user?.name}</span>
        </div>
      )
    },
  },
  {
    key: "course",
    label: "Course",
    render: (enrollment: any, onEdit: any, onDelete: any, context: any) => {
      const course = context.courses.find((c: any) => c.id === enrollment.courseId)
      return course?.title
    },
  },
  {
    key: "status",
    label: "Status",
    render: (enrollment: any) => (
      <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>{enrollment.status}</Badge>
    ),
  },
  {
    key: "progress",
    label: "Progress",
    render: (enrollment: any) => `${enrollment.progress}%`,
  },
  {
    key: "enrolledAt",
    label: "Enrolled",
    render: (enrollment: any) => new Date(enrollment.enrolledAt).toLocaleDateString(),
  },
  {
    key: "actions",
    label: "",
    render: (enrollment: any, onEdit: any, onDelete: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(enrollment)}>Update Progress</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(enrollment)} className="text-destructive">
            Remove Enrollment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function AdminEnrollmentsPage() {
  const { state, dispatch } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")

  const handleUpdateProgress = (enrollment: any) => {
    const newProgress = prompt("Enter new progress (0-100):", enrollment.progress.toString())
    if (newProgress && !isNaN(Number(newProgress))) {
      const progress = Math.min(100, Math.max(0, Number(newProgress)))
      dispatch({
        type: "UPDATE_ENROLLMENT",
        payload: {
          ...enrollment,
          progress,
          status: progress === 100 ? "completed" : "in-progress",
        },
      })
    }
  }

  const handleDeleteEnrollment = (enrollment: any) => {
    if (confirm("Are you sure you want to remove this enrollment?")) {
      dispatch({
        type: "DELETE_ENROLLMENT",
        payload: enrollment.id,
      })
    }
  }

  const filteredEnrollments = state.enrollments.filter((enrollment) => {
    const user = state.users.find((u) => u.id === enrollment.userId)
    const course = state.courses.find((c) => c.id === enrollment.courseId)
    return (
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enrollment Management</h1>
          <p className="text-muted-foreground">Track and manage course enrollments</p>
        </div>
        <Button>
          <GraduationCap className="mr-2 h-4 w-4" />
          Manual Enrollment
        </Button>
      </div>

      <DataTable
        data={filteredEnrollments}
        columns={enrollmentColumns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search enrollments..."
        onEdit={handleUpdateProgress}
        onDelete={handleDeleteEnrollment}
        context={state}
      />
    </div>
  )
}
