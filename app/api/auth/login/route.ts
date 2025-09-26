import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user by email
    const user = await User.findOne({ email: validatedData.email })
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }
    
    // Check password (in production, use bcrypt or similar)
    if (user.password !== validatedData.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }
    
    // Generate JWT token (simplified for demo)
    const token = `jwt-${user._id}-${Date.now()}`
    
    // Return user data without password
    const userResponse = user.toJSON()
    
    return NextResponse.json({
      user: userResponse,
      token,
      message: "Login successful"
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
