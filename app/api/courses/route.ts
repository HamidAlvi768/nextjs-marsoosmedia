import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import Course from "@/lib/models/Course"

// Validation schema for course creation
const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  instructor: z.string().min(1, "Instructor is required"),
  instructorId: z.string().min(1, "Instructor ID is required"),
  price: z.number().min(0, "Price must be non-negative"),
  duration: z.string().min(1, "Duration is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  thumbnail: z.string().url().optional(),
  category: z.string().min(1, "Category is required"),
  lessons: z.array(z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
    duration: z.number(),
    order: z.number(),
  })).default([]),
})

// Initialize demo courses if database is empty
async function initializeDemoCourses() {
  const courseCount = await Course.countDocuments()
  if (courseCount === 0) {
    const demoCourses = [
      {
        title: "Complete React Development",
        description: "Learn React from basics to advanced concepts including hooks, context, and modern patterns.",
        instructor: "John Doe",
        instructorId: "1",
        price: 99.99,
        duration: "12 weeks",
        level: "intermediate" as const,
        thumbnail: "/placeholder.svg?height=300&width=400&text=React+Course",
        category: "Web Development",
        lessons: [
          {
            title: "Introduction to React",
            description: "Getting started with React fundamentals",
            content: "React is a JavaScript library...",
            duration: 45,
            order: 1,
          },
        ],
        enrolledStudents: 1250,
        rating: 4.8,
      },
      {
        title: "Advanced TypeScript",
        description: "Master TypeScript with advanced types, generics, and real-world applications.",
        instructor: "Jane Smith",
        instructorId: "2",
        price: 129.99,
        duration: "8 weeks",
        level: "advanced" as const,
        thumbnail: "/placeholder.svg?height=300&width=400&text=TypeScript+Course",
        category: "Programming",
        lessons: [],
        enrolledStudents: 890,
        rating: 4.9,
      },
    ]
    
    await Course.insertMany(demoCourses)
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    await initializeDemoCourses()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const search = searchParams.get("search")

    // Build query
    let query: any = {}

    // Apply filters
    if (category && category !== "All Categories") {
      query.category = category
    }

    if (level && level !== "All Levels") {
      query.level = level
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ]
    }

    const courses = await Course.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      courses,
      total: courses.length
    })
  } catch (error) {
    console.error("Get courses error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validate input
    const validatedData = courseSchema.parse(body)
    
    // Create new course
    const newCourse = new Course({
      ...validatedData,
      enrolledStudents: 0,
      rating: 0,
    })
    
    // Save course to database
    const savedCourse = await newCourse.save()
    
    return NextResponse.json({
      course: savedCourse,
      message: "Course created successfully"
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Create course error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
