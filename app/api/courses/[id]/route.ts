import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import Course from "@/lib/models/Course"

// Validation schema for course updates
const updateCourseSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  instructor: z.string().min(1, "Instructor is required").optional(),
  instructorId: z.string().min(1, "Instructor ID is required").optional(),
  price: z.number().min(0, "Price must be non-negative").optional(),
  duration: z.string().min(1, "Duration is required").optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  thumbnail: z.string().url().optional(),
  category: z.string().min(1, "Category is required").optional(),
  lessons: z.array(z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
    duration: z.number(),
    order: z.number(),
  })).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const courseId = params.id
    
    const course = await Course.findById(courseId)
    
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ course })
    
  } catch (error) {
    console.error("Get course error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const courseId = params.id
    const body = await request.json()
    
    // Validate input
    const validatedData = updateCourseSchema.parse(body)
    
    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      validatedData,
      { new: true, runValidators: true }
    )
    
    if (!updatedCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      course: updatedCourse,
      message: "Course updated successfully"
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Update course error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const courseId = params.id
    
    // Delete course
    const deletedCourse = await Course.findByIdAndDelete(courseId)
    
    if (!deletedCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: "Course deleted successfully"
    })
    
  } catch (error) {
    console.error("Delete course error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
