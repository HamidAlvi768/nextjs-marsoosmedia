import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "instructor"]).default("student"),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }
    
    // Create new user
    const newUser = new User({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password, // In production, hash this password
      role: validatedData.role,
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "",
    })
    
    // Save user to database
    const savedUser = await newUser.save()
    
    // Generate JWT token (simplified for demo)
    const token = `jwt-${savedUser._id}-${Date.now()}`
    
    // Return user data without password
    const userResponse = savedUser.toJSON()
    
    return NextResponse.json({
      user: userResponse,
      token,
      message: "Registration successful"
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
