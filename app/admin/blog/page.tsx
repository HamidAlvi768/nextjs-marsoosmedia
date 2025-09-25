"use client"
import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { DataTable } from "@/components/reusable/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TableConfig } from "@/lib/types"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function AdminBlogPage() {
  const { state, dispatch } = useApp()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const handleEdit = (post: any) => {
    window.location.href = `/admin/blog/${post.id}/edit`
  }

  const handleView = (post: any) => {
    window.location.href = `/blog/${post.id}`
  }

  const handleDelete = (post: any) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      dispatch({ type: "DELETE_BLOG_POST", payload: post.id })
    }
  }

  const tableConfig: TableConfig = {
    columns: [
      {
        key: "thumbnail",
        label: "Image",
        render: (value) => (
          <img src={value || "/placeholder.svg"} alt="Post" className="w-12 h-12 object-cover rounded" />
        ),
      },
      {
        key: "title",
        label: "Title",
        sortable: true,
      },
      {
        key: "author",
        label: "Author",
        sortable: true,
      },
      {
        key: "category",
        label: "Category",
        render: (value) => <Badge variant="secondary">{value}</Badge>,
      },
      {
        key: "isPublished",
        label: "Status",
        render: (value) => <Badge variant={value ? "default" : "secondary"}>{value ? "Published" : "Draft"}</Badge>,
      },
      {
        key: "views",
        label: "Views",
        sortable: true,
      },
      {
        key: "likes",
        label: "Likes",
        sortable: true,
      },
      {
        key: "publishedAt",
        label: "Published",
        sortable: true,
        render: (value) => new Date(value).toLocaleDateString(),
      },
    ],
    data: state.blogPosts,
    actions: {
      view: handleView,
      edit: handleEdit,
      delete: handleDelete,
    },
    pagination: {
      page: currentPage,
      pageSize,
      total: state.blogPosts.length,
      onPageChange: setCurrentPage,
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <DataTable config={tableConfig} title="All Blog Posts" />
    </div>
  )
}
