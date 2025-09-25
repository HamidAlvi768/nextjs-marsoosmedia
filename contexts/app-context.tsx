"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { AppState, AppAction, Course, BlogPost, Comment } from "@/lib/types"

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

  // Load initial data (mock data for now)
  useEffect(() => {
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

    const mockEnrollments = [
      {
        id: "1",
        userId: "3",
        courseId: "1",
        progress: 75,
        completedLessons: ["1"],
        enrolledAt: new Date("2024-02-01"),
        status: "in-progress" as const,
      },
      {
        id: "2",
        userId: "4",
        courseId: "1",
        progress: 100,
        completedLessons: ["1"],
        enrolledAt: new Date("2024-01-25"),
        completedAt: new Date("2024-03-01"),
        status: "completed" as const,
      },
      {
        id: "3",
        userId: "3",
        courseId: "2",
        progress: 30,
        completedLessons: [],
        enrolledAt: new Date("2024-02-15"),
        status: "in-progress" as const,
      },
    ]

    const mockCourses: Course[] = [
      {
        id: "1",
        title: "Complete React Development",
        description: "Learn React from basics to advanced concepts including hooks, context, and modern patterns.",
        instructor: "John Doe",
        instructorId: "1",
        price: 99.99,
        duration: "12 weeks",
        level: "intermediate",
        thumbnail: "/placeholder.svg?height=300&width=400&text=React+Course",
        category: "Web Development",
        lessons: [
          {
            id: "1",
            courseId: "1",
            title: "Introduction to React",
            description: "Getting started with React fundamentals",
            content: "React is a JavaScript library...",
            duration: 45,
            order: 1,
          },
        ],
        enrolledStudents: 1250,
        rating: 4.8,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        title: "Advanced TypeScript",
        description: "Master TypeScript with advanced types, generics, and real-world applications.",
        instructor: "Jane Smith",
        instructorId: "2",
        price: 129.99,
        duration: "8 weeks",
        level: "advanced",
        thumbnail: "/placeholder.svg?height=300&width=400&text=TypeScript+Course",
        category: "Programming",
        lessons: [],
        enrolledStudents: 890,
        rating: 4.9,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
      },
    ]

    const mockBlogPosts: BlogPost[] = [
      {
        id: "1",
        title: "The Future of Web Development in 2024",
        content: `Web development continues to evolve rapidly, with new technologies and frameworks emerging constantly. In 2024, we're seeing significant shifts in how developers approach building applications.

React and Next.js continue to dominate the frontend landscape, with server components and the app router revolutionizing how we think about rendering. The introduction of React Server Components has blurred the lines between client and server, allowing for more efficient data fetching and improved performance.

TypeScript adoption has reached new heights, with most new projects defaulting to TypeScript for its type safety and developer experience benefits. The ecosystem has matured significantly, with excellent tooling and IDE support.

On the backend, we're seeing a rise in edge computing and serverless architectures. Platforms like Vercel, Netlify, and Cloudflare Workers are making it easier than ever to deploy globally distributed applications.

The JAMstack architecture continues to gain popularity, with static site generators like Next.js, Gatsby, and Nuxt.js leading the charge. This approach offers excellent performance, security, and developer experience.

Looking ahead, we can expect to see more innovation in areas like:
- AI-powered development tools
- Improved developer experience with better debugging and testing tools
- Enhanced performance optimization techniques
- Better accessibility and inclusive design practices

The future of web development is bright, with exciting opportunities for developers to create amazing user experiences.`,
        excerpt:
          "Exploring the latest trends and technologies shaping web development in 2024, from React Server Components to edge computing.",
        author: "John Doe",
        authorId: "1",
        thumbnail: "/placeholder.svg?height=400&width=600&text=Web+Development+2024",
        category: "Technology",
        tags: ["web development", "trends", "2024", "react", "nextjs"],
        publishedAt: new Date("2024-03-01"),
        updatedAt: new Date("2024-03-01"),
        isPublished: true,
        views: 1500,
        likes: 89,
      },
      {
        id: "2",
        title: "Mastering React Hooks: A Complete Guide",
        content: `React Hooks have revolutionized how we write React components, providing a more functional approach to state management and side effects. In this comprehensive guide, we'll explore all the essential hooks and how to use them effectively.

useState is the most fundamental hook, allowing functional components to have local state. It's simple yet powerful, replacing the need for class components in most cases.

useEffect handles side effects in functional components, combining the functionality of componentDidMount, componentDidUpdate, and componentWillUnmount from class components.

Custom hooks are where the real power lies. They allow you to extract component logic into reusable functions, promoting code reuse and separation of concerns.

Advanced hooks like useReducer, useContext, and useMemo provide more sophisticated state management and performance optimization capabilities.

Best practices include:
- Keep hooks at the top level of your components
- Use custom hooks for complex logic
- Optimize with useMemo and useCallback when necessary
- Follow the rules of hooks consistently

By mastering React Hooks, you'll write cleaner, more maintainable React code that's easier to test and debug.`,
        excerpt:
          "A comprehensive guide to React Hooks, covering everything from basic useState to advanced custom hooks.",
        author: "Jane Smith",
        authorId: "2",
        thumbnail: "/placeholder.svg?height=400&width=600&text=React+Hooks",
        category: "Programming",
        tags: ["react", "hooks", "javascript", "frontend"],
        publishedAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-15"),
        isPublished: true,
        views: 2100,
        likes: 156,
      },
    ]

    const mockComments: Comment[] = [
      {
        id: "1",
        postId: "1",
        userId: "3",
        userName: "Alice Johnson",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content:
          "Great article! I especially found the section on React Server Components interesting. Do you think this will completely replace client-side rendering?",
        createdAt: new Date("2024-03-02"),
        updatedAt: new Date("2024-03-02"),
      },
      {
        id: "2",
        postId: "1",
        userId: "4",
        userName: "Bob Wilson",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content:
          "Thanks for sharing this comprehensive overview. The edge computing trend is particularly exciting for global applications.",
        createdAt: new Date("2024-03-03"),
        updatedAt: new Date("2024-03-03"),
      },
    ]

    dispatch({ type: "SET_USERS", payload: mockUsers })
    dispatch({ type: "SET_CURRENT_USER", payload: mockUsers[2] }) // Set Alice as current user for demo
    dispatch({ type: "SET_COURSES", payload: mockCourses })
    dispatch({ type: "SET_ENROLLMENTS", payload: mockEnrollments })
    dispatch({ type: "SET_BLOG_POSTS", payload: mockBlogPosts })
    dispatch({ type: "SET_COMMENTS", payload: mockComments })
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
