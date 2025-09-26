import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Enrollment from "@/lib/models/Enrollment"

// Initialize demo enrollments if database is empty
async function initializeDemoEnrollments() {
  const enrollmentCount = await Enrollment.countDocuments()
  if (enrollmentCount === 0) {
    const demoEnrollments = [
      {
        userId: "3",
        courseId: "1",
        progress: 75,
        completedLessons: ["1"],
        enrolledAt: new Date("2024-02-01"),
        status: "in-progress" as const,
      },
      {
        userId: "4",
        courseId: "1",
        progress: 100,
        completedLessons: ["1"],
        enrolledAt: new Date("2024-01-25"),
        completedAt: new Date("2024-03-01"),
        status: "completed" as const,
      },
      {
        userId: "3",
        courseId: "2",
        progress: 30,
        completedLessons: [],
        enrolledAt: new Date("2024-02-15"),
        status: "in-progress" as const,
      },
    ]
    
    await Enrollment.insertMany(demoEnrollments)
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    await initializeDemoEnrollments()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const courseId = searchParams.get("courseId")

    // Build query
    let query: any = {}

    // Apply filters
    if (userId) {
      query.userId = userId
    }

    if (courseId) {
      query.courseId = courseId
    }

    const enrollments = await Enrollment.find(query).sort({ enrolledAt: -1 })

    return NextResponse.json({
      enrollments,
      total: enrollments.length
    })
  } catch (error) {
    console.error("Get enrollments error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
