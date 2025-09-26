import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import Enrollment from "@/lib/models/Enrollment"
import Course from "@/lib/models/Course"

// Validation schema
const enrollSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
})


export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id
    const body = await request.json()
    
    // Validate input
    const validatedData = enrollSchema.parse(body)
    
    await connectDB()
    
    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }
    
    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: validatedData.userId,
      courseId: courseId
    })
    
    if (existingEnrollment) {
      return NextResponse.json(
        { error: "User is already enrolled in this course" },
        { status: 400 }
      )
    }
    
    // Create new enrollment
    const newEnrollment = new Enrollment({
      userId: validatedData.userId,
      courseId,
      progress: 0,
      completedLessons: [],
      enrolledAt: new Date(),
      status: "in-progress",
    })
    
    // Save enrollment to database
    const savedEnrollment = await newEnrollment.save()
    
    // Update course enrolled students count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolledStudents: 1 }
    })
    
    return NextResponse.json({
      enrollment: savedEnrollment,
      message: "Successfully enrolled in course"
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Enroll error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
