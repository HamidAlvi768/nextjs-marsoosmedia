import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import Comment from "@/lib/models/Comment"
import BlogPost from "@/lib/models/BlogPost"

// Validation schema for comment creation
const commentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(1, "User name is required"),
  userAvatar: z.string().url().optional(),
  content: z.string().min(1, "Content is required"),
  parentId: z.string().optional(),
})

// Initialize demo comments if database is empty
async function initializeDemoComments() {
  const commentCount = await Comment.countDocuments()
  if (commentCount === 0) {
    const demoComments = [
      {
        postId: "1",
        userId: "3",
        userName: "Alice Johnson",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content: "Great article! I especially found the section on React Server Components interesting. Do you think this will completely replace client-side rendering?",
        createdAt: new Date("2024-03-02"),
      },
      {
        postId: "1",
        userId: "4",
        userName: "Bob Wilson",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content: "Thanks for sharing this comprehensive overview. The edge computing trend is particularly exciting for global applications.",
        createdAt: new Date("2024-03-03"),
      },
    ]
    
    await Comment.insertMany(demoComments)
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    await initializeDemoComments()
    
    const postId = params.id
    
    const postComments = await Comment.find({ postId }).sort({ createdAt: -1 })
    
    return NextResponse.json({
      comments: postComments,
      total: postComments.length
    })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const postId = params.id
    const body = await request.json()
    
    // Validate input
    const validatedData = commentSchema.parse(body)
    
    // Check if blog post exists
    const blogPost = await BlogPost.findById(postId)
    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // Create new comment
    const newComment = new Comment({
      postId,
      ...validatedData,
    })
    
    // Save comment to database
    const savedComment = await newComment.save()
    
    return NextResponse.json({
      comment: savedComment,
      message: "Comment added successfully"
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Add comment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
