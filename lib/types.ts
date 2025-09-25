import type React from "react"
// Core types for the application
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "student" | "instructor"
  avatar?: string
  bio?: string
  createdAt: Date
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorId: string
  price: number
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  thumbnail: string
  category: string
  lessons: Lesson[]
  enrolledStudents: number
  rating: number
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl?: string
  content: string
  duration: number
  order: number
  isCompleted?: boolean
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  progress: number
  completedLessons: string[]
  enrolledAt: Date
  completedAt?: Date
  status: "in-progress" | "completed" | "paused"
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  authorId: string
  thumbnail: string
  category: string
  tags: string[]
  publishedAt: Date
  updatedAt: Date
  isPublished: boolean
  views: number
  likes: number
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  parentId?: string
  replies?: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface AppState {
  user: User | null
  users: User[]
  currentUser: User | null
  courses: Course[]
  enrollments: Enrollment[]
  blogPosts: BlogPost[]
  comments: Comment[]
  loading: boolean
  error: string | null
}

export type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "ADD_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "DELETE_USER"; payload: string }
  | { type: "SET_COURSES"; payload: Course[] }
  | { type: "ADD_COURSE"; payload: Course }
  | { type: "UPDATE_COURSE"; payload: Course }
  | { type: "DELETE_COURSE"; payload: string }
  | { type: "SET_ENROLLMENTS"; payload: Enrollment[] }
  | { type: "ADD_ENROLLMENT"; payload: Enrollment }
  | { type: "UPDATE_ENROLLMENT"; payload: Enrollment }
  | { type: "DELETE_ENROLLMENT"; payload: string }
  | { type: "SET_BLOG_POSTS"; payload: BlogPost[] }
  | { type: "ADD_BLOG_POST"; payload: BlogPost }
  | { type: "UPDATE_BLOG_POST"; payload: BlogPost }
  | { type: "DELETE_BLOG_POST"; payload: string }
  | { type: "SET_COMMENTS"; payload: Comment[] }
  | { type: "ADD_COMMENT"; payload: Comment }
  | { type: "UPDATE_COMMENT"; payload: Comment }
  | { type: "DELETE_COMMENT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

// Form configuration types for reusable forms
export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "textarea" | "select" | "number" | "file" | "checkbox" | "date"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface FormConfig {
  title: string
  fields: FormField[]
  submitText: string
  onSubmit: (data: any) => void
}

// Table configuration types for reusable tables
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

export interface TableConfig {
  columns: TableColumn[]
  data: any[]
  actions?: {
    edit?: (row: any) => void
    delete?: (row: any) => void
    view?: (row: any) => void
  }
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
}
