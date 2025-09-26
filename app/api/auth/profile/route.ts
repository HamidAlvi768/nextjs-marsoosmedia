import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7) // Remove "Bearer " prefix
    
    // Extract user ID from token (simplified for demo)
    const userId = token.split("-")[1]
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }
    
    // Find user by ID
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Return user data without password
    const userResponse = user.toJSON()
    
    return NextResponse.json({
      user: userResponse
    })
    
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7) // Remove "Bearer " prefix
    
    // Extract user ID from token (simplified for demo)
    const userId = token.split("-")[1]
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...body },
      { new: true, runValidators: true }
    )
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Return updated user data without password
    const userResponse = updatedUser.toJSON()
    
    return NextResponse.json({
      user: userResponse,
      message: "Profile updated successfully"
    })
    
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
