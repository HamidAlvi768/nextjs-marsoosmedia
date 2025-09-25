"use client"
import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DataTable } from "@/components/reusable/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, EyeOff } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const commentColumns = [
  {
    key: "author",
    label: "Author",
    render: (comment: any, onEdit: any, onDelete: any, context: any) => {
      const user = context.users.find((u: any) => u.id === comment.userId)
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
    key: "content",
    label: "Comment",
    render: (comment: any) => <div className="max-w-xs truncate">{comment.content}</div>,
  },
  {
    key: "post",
    label: "Blog Post",
    render: (comment: any, onEdit: any, onDelete: any, context: any) => {
      const post = context.blogPosts.find((p: any) => p.id === comment.postId)
      return <div className="max-w-xs truncate">{post?.title}</div>
    },
  },
  {
    key: "status",
    label: "Status",
    render: (comment: any) => (
      <Badge variant={comment.isHidden ? "destructive" : "default"}>{comment.isHidden ? "Hidden" : "Visible"}</Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Posted",
    render: (comment: any) => new Date(comment.createdAt).toLocaleDateString(),
  },
  {
    key: "actions",
    label: "",
    render: (comment: any, onEdit: any, onDelete: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(comment)}>
            {comment.isHidden ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Comment
              </>
            ) : (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Comment
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(comment)} className="text-destructive">
            Delete Comment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function AdminCommentsPage() {
  const { state, dispatch } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")

  const handleToggleVisibility = (comment: any) => {
    dispatch({
      type: "UPDATE_COMMENT",
      payload: { ...comment, isHidden: !comment.isHidden },
    })
  }

  const handleDeleteComment = (comment: any) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      dispatch({
        type: "DELETE_COMMENT",
        payload: comment.id,
      })
    }
  }

  const filteredComments = state.comments.filter((comment) => {
    const user = state.users.find((u) => u.id === comment.userId)
    const post = state.blogPosts.find((p) => p.id === comment.postId)
    return (
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post?.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comment Management</h1>
          <p className="text-muted-foreground">Moderate and manage blog comments</p>
        </div>
      </div>

      <DataTable
        data={filteredComments}
        columns={commentColumns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search comments..."
        onEdit={handleToggleVisibility}
        onDelete={handleDeleteComment}
        context={state}
      />
    </div>
  )
}
