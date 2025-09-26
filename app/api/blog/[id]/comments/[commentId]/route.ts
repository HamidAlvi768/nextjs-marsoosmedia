import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// In-memory storage for comments
let comments: Array<{
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
}> = []

// Initialize with demo comments
if (comments.length === 0) {
  comments = [
    {
      id: "1",
      postId: "1",
      userId: "3",
      userName: "Alice Johnson",
      userAvatar: "/placeholder.svg?height=40&width=40",
      content: "Great article! I especially found the section on React Server Components interesting. Do you think this will completely replace client-side rendering?",
      createdAt: new Date("2024-03-02"),
      updatedAt: new Date("2024-03-02"),
    },
    {
      id: "2",
      postId: "1",
      userId: "4",
      userName: "Bob Wilson",
      userAvatar: "/placeholder.svg?height=40&width=40",
      content: "Thanks for sharing this comprehensive overview. The edge computing trend is particularly exciting for global applications.",
      createdAt: new Date("2024-03-03"),
      updatedAt: new Date("2024-03-03"),
    },
  ]
}

// Validation schema for comment updates
const updateCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id: postId, commentId } = params
    const body = await request.json()
    
    // Validate input
    const validatedData = updateCommentSchema.parse(body)
    
    // Find comment
    const commentIndex = comments.findIndex(
      c => c.id === commentId && c.postId === postId
    )
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }
    
    // Update comment
    comments[commentIndex] = {
      ...comments[commentIndex],
      content: validatedData.content,
      updatedAt: new Date(),
    }
    
    return NextResponse.json({
      comment: comments[commentIndex],
      message: "Comment updated successfully"
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Update comment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id: postId, commentId } = params
    
    // Find comment
    const commentIndex = comments.findIndex(
      c => c.id === commentId && c.postId === postId
    )
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }
    
    // Remove comment
    comments.splice(commentIndex, 1)
    
    return NextResponse.json({
      message: "Comment deleted successfully"
    })
    
  } catch (error) {
    console.error("Delete comment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
