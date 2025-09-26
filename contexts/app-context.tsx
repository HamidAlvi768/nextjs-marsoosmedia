"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { AppState, AppAction, Course, BlogPost, Comment } from "@/lib/types"
import { coursesAPI, blogAPI } from "@/lib/api"

// Initial state
const initialState: AppState = {
  user: null,
  users: [],
  currentUser: null,
  courses: [],
  enrollments: [],
  blogPosts: [],
  comments: [],
  loading: false,
  error: null,
}

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }

    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload }

    case "SET_USERS":
      return { ...state, users: action.payload }

    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] }

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      }

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      }

    case "SET_COURSES":
      return { ...state, courses: action.payload }

    case "ADD_COURSE":
      return { ...state, courses: [...state.courses, action.payload] }

    case "UPDATE_COURSE":
      return {
        ...state,
        courses: state.courses.map((course) => (course.id === action.payload.id ? action.payload : course)),
      }

    case "DELETE_COURSE":
      return {
        ...state,
        courses: state.courses.filter((course) => course.id !== action.payload),
      }

    case "SET_ENROLLMENTS":
      return { ...state, enrollments: action.payload }

    case "ADD_ENROLLMENT":
      return { ...state, enrollments: [...state.enrollments, action.payload] }

    case "UPDATE_ENROLLMENT":
      return {
        ...state,
        enrollments: state.enrollments.map((enrollment) =>
          enrollment.id === action.payload.id ? action.payload : enrollment,
        ),
      }

    case "DELETE_ENROLLMENT":
      return {
        ...state,
        enrollments: state.enrollments.filter((enrollment) => enrollment.id !== action.payload),
      }

    case "SET_BLOG_POSTS":
      return { ...state, blogPosts: action.payload }

    case "ADD_BLOG_POST":
      return { ...state, blogPosts: [...state.blogPosts, action.payload] }

    case "UPDATE_BLOG_POST":
      return {
        ...state,
        blogPosts: state.blogPosts.map((post) => (post.id === action.payload.id ? action.payload : post)),
      }

    case "DELETE_BLOG_POST":
      return {
        ...state,
        blogPosts: state.blogPosts.filter((post) => post.id !== action.payload),
      }

    case "SET_COMMENTS":
      return { ...state, comments: action.payload }

    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.payload] }

    case "UPDATE_COMMENT":
      return {
        ...state,
        comments: state.comments.map((comment) => (comment.id === action.payload.id ? action.payload : comment)),
      }

    case "DELETE_COMMENT":
      return {
        ...state,
        comments: state.comments.filter((comment) => comment.id !== action.payload),
      }

    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload }

    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load initial data from API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })
        
        // Load courses
        const coursesResponse = await coursesAPI.getAll()
        dispatch({ type: "SET_COURSES", payload: coursesResponse.data.courses })
        
        // Load blog posts
        const blogResponse = await blogAPI.getAll()
        dispatch({ type: "SET_BLOG_POSTS", payload: blogResponse.data.posts })
        
        // Load enrollments
        const enrollmentsResponse = await coursesAPI.getEnrollments()
        dispatch({ type: "SET_ENROLLMENTS", payload: enrollmentsResponse.data.enrollments })
        
        // Set demo users and current user for demo purposes
        const mockUsers = [
          {
            id: "1",
            email: "john@example.com",
            name: "John Doe",
            role: "admin" as const,
            avatar: "/placeholder.svg?height=40&width=40",
            bio: "Experienced web developer and instructor",
            createdAt: new Date("2024-01-01"),
          },
          {
            id: "2",
            email: "jane@example.com",
            name: "Jane Smith",
            role: "instructor" as const,
            avatar: "/placeholder.svg?height=40&width=40",
            bio: "TypeScript expert and software architect",
            createdAt: new Date("2024-01-02"),
          },
          {
            id: "3",
            email: "alice@example.com",
            name: "Alice Johnson",
            role: "student" as const,
            avatar: "/placeholder.svg?height=40&width=40",
            bio: "Passionate learner and aspiring developer",
            createdAt: new Date("2024-01-15"),
          },
          {
            id: "4",
            email: "bob@example.com",
            name: "Bob Wilson",
            role: "student" as const,
            avatar: "/placeholder.svg?height=40&width=40",
            bio: "Frontend developer looking to expand skills",
            createdAt: new Date("2024-01-20"),
          },
        ]
        
        dispatch({ type: "SET_USERS", payload: mockUsers })
        dispatch({ type: "SET_CURRENT_USER", payload: mockUsers[2] }) // Set Alice as current user for demo
        
        // Load comments for blog posts
        const comments: Comment[] = []
        for (const post of blogResponse.data.posts) {
          try {
            const commentsResponse = await blogAPI.getComments(post.id)
            comments.push(...commentsResponse.data.comments)
          } catch (error) {
            console.error(`Failed to load comments for post ${post.id}:`, error)
          }
        }
        dispatch({ type: "SET_COMMENTS", payload: comments })
        
      } catch (error) {
        console.error("Failed to load initial data:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to load data" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadInitialData()
  }, [])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

export const useApp = useAppContext
