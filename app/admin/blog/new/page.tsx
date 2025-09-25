"use client"
import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { DynamicForm } from "@/components/reusable/dynamic-form"
import type { FormConfig } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewBlogPostPage() {
  const { state, dispatch } = useApp()
  const [loading, setLoading] = useState(false)

  const formConfig: FormConfig = {
    title: "Create New Blog Post",
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Enter post title",
        required: true,
        validation: {
          min: 5,
          max: 200,
          message: "Title must be between 5 and 200 characters",
        },
      },
      {
        name: "excerpt",
        label: "Excerpt",
        type: "textarea",
        placeholder: "Brief description of the post",
        required: true,
        validation: {
          min: 20,
          max: 500,
          message: "Excerpt must be between 20 and 500 characters",
        },
      },
      {
        name: "content",
        label: "Content",
        type: "textarea",
        placeholder: "Write your blog post content here...",
        required: true,
        validation: {
          min: 100,
          message: "Content must be at least 100 characters",
        },
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { value: "Technology", label: "Technology" },
          { value: "Programming", label: "Programming" },
          { value: "Design", label: "Design" },
          { value: "Business", label: "Business" },
          { value: "Marketing", label: "Marketing" },
          { value: "Education", label: "Education" },
        ],
      },
      {
        name: "tags",
        label: "Tags (comma-separated)",
        type: "text",
        placeholder: "react, javascript, web development",
        required: true,
      },
      {
        name: "thumbnail",
        label: "Thumbnail URL",
        type: "text",
        placeholder: "https://example.com/image.jpg",
      },
      {
        name: "isPublished",
        label: "Publish immediately",
        type: "checkbox",
      },
    ],
    submitText: "Create Post",
    onSubmit: handleSubmit,
  }

  async function handleSubmit(data: any) {
    if (!state.user) return

    setLoading(true)
    try {
      const newPost = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        author: state.user.name,
        authorId: state.user.id,
        thumbnail: data.thumbnail || "/placeholder.svg?height=400&width=600&text=Blog+Post",
        category: data.category,
        tags: data.tags.split(",").map((tag: string) => tag.trim()),
        publishedAt: new Date(),
        updatedAt: new Date(),
        isPublished: data.isPublished || false,
        views: 0,
        likes: 0,
      }

      dispatch({ type: "ADD_BLOG_POST", payload: newPost })

      // Redirect to blog management
      window.location.href = "/admin/blog"
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Management
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl">
        <DynamicForm config={formConfig} loading={loading} />
      </div>
    </div>
  )
}
