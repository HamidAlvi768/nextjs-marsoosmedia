"use client"
import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { DynamicForm } from "@/components/reusable/dynamic-form"
import type { FormConfig } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewCoursePage() {
  const { state, dispatch } = useApp()
  const [loading, setLoading] = useState(false)

  const formConfig: FormConfig = {
    title: "Create New Course",
    fields: [
      {
        name: "title",
        label: "Course Title",
        type: "text",
        placeholder: "Enter course title",
        required: true,
        validation: {
          min: 5,
          max: 200,
          message: "Title must be between 5 and 200 characters",
        },
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe what students will learn",
        required: true,
        validation: {
          min: 50,
          max: 1000,
          message: "Description must be between 50 and 1000 characters",
        },
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { value: "Web Development", label: "Web Development" },
          { value: "Programming", label: "Programming" },
          { value: "Data Science", label: "Data Science" },
          { value: "Design", label: "Design" },
          { value: "Business", label: "Business" },
          { value: "Marketing", label: "Marketing" },
        ],
      },
      {
        name: "level",
        label: "Level",
        type: "select",
        required: true,
        options: [
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
        ],
      },
      {
        name: "price",
        label: "Price ($)",
        type: "number",
        placeholder: "99.99",
        required: true,
        validation: {
          min: 0,
          message: "Price must be a positive number",
        },
      },
      {
        name: "duration",
        label: "Duration",
        type: "text",
        placeholder: "8 weeks",
        required: true,
      },
      {
        name: "thumbnail",
        label: "Thumbnail URL",
        type: "text",
        placeholder: "https://example.com/image.jpg",
      },
    ],
    submitText: "Create Course",
    onSubmit: handleSubmit,
  }

  async function handleSubmit(data: any) {
    if (!state.user) return

    setLoading(true)
    try {
      const newCourse = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        instructor: state.user.name,
        instructorId: state.user.id,
        price: Number.parseFloat(data.price),
        duration: data.duration,
        level: data.level,
        thumbnail: data.thumbnail || "/placeholder.svg?height=400&width=600&text=Course",
        category: data.category,
        lessons: [],
        enrolledStudents: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dispatch({ type: "ADD_COURSE", payload: newCourse })

      // Redirect to courses management
      window.location.href = "/admin/courses"
    } catch (error) {
      console.error("Failed to create course:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses Management
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl">
        <DynamicForm config={formConfig} loading={loading} />
      </div>
    </div>
  )
}
