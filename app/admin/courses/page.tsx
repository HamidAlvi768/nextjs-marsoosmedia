"use client"
import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { coursesAPI } from "@/lib/api"
import { DataTable } from "@/components/reusable/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TableConfig } from "@/lib/types"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function AdminCoursesPage() {
  const { state, dispatch } = useApp()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const handleEdit = (course: any) => {
    // Navigate to edit page
    window.location.href = `/admin/courses/${course.id}/edit`
  }

  const handleView = (course: any) => {
    // Navigate to course detail page
    window.location.href = `/courses/${course.id}`
  }

  const handleDelete = async (course: any) => {
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      try {
        await coursesAPI.delete(course.id)
        dispatch({ type: "DELETE_COURSE", payload: course.id })
      } catch (error) {
        console.error("Failed to delete course:", error)
        alert("Failed to delete course. Please try again.")
      }
    }
  }

  const tableConfig: TableConfig = {
    columns: [
      {
        key: "thumbnail",
        label: "Image",
        render: (value) => (
          <img src={value || "/placeholder.svg"} alt="Course" className="w-12 h-12 object-cover rounded" />
        ),
      },
      {
        key: "title",
        label: "Title",
        sortable: true,
      },
      {
        key: "instructor",
        label: "Instructor",
        sortable: true,
      },
      {
        key: "category",
        label: "Category",
        render: (value) => <Badge variant="secondary">{value}</Badge>,
      },
      {
        key: "level",
        label: "Level",
        render: (value) => {
          const colors = {
            beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          }
          return <Badge className={colors[value as keyof typeof colors] || ""}>{value}</Badge>
        },
      },
      {
        key: "price",
        label: "Price",
        sortable: true,
        render: (value) => `$${value}`,
      },
      {
        key: "enrolledStudents",
        label: "Students",
        sortable: true,
      },
      {
        key: "rating",
        label: "Rating",
        sortable: true,
        render: (value) => `${value} ⭐`,
      },
      {
        key: "createdAt",
        label: "Created",
        sortable: true,
        render: (value) => new Date(value).toLocaleDateString(),
      },
    ],
    data: state.courses,
    actions: {
      view: handleView,
      edit: handleEdit,
      delete: handleDelete,
    },
    pagination: {
      page: currentPage,
      pageSize,
      total: state.courses.length,
      onPageChange: setCurrentPage,
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses Management</h1>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Link>
        </Button>
      </div>

      <DataTable config={tableConfig} title="All Courses" />
    </div>
  )
}
