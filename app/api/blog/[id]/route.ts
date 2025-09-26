import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Import the blog posts array from the main route
// In a real app, this would be a shared database module
let blogPosts: Array<{
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
}> = []

// Initialize with demo blog posts (same as main route)
if (blogPosts.length === 0) {
  blogPosts = [
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
      excerpt: "Exploring the latest trends and technologies shaping web development in 2024, from React Server Components to edge computing.",
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
      excerpt: "A comprehensive guide to React Hooks, covering everything from basic useState to advanced custom hooks.",
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
}

// Validation schema for blog post updates
const updateBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().min(1, "Excerpt is required").optional(),
  author: z.string().min(1, "Author is required").optional(),
  authorId: z.string().min(1, "Author ID is required").optional(),
  thumbnail: z.string().url().optional(),
  category: z.string().min(1, "Category is required").optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id
    
    const post = blogPosts.find(p => p.id === postId)
    
    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // Increment views when post is accessed
    post.views += 1
    
    return NextResponse.json({ post })
    
  } catch (error) {
    console.error("Get blog post error:", error)
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
    const postId = params.id
    const body = await request.json()
    
    // Validate input
    const validatedData = updateBlogPostSchema.parse(body)
    
    // Find post
    const postIndex = blogPosts.findIndex(p => p.id === postId)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // Update post
    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      ...validatedData,
      updatedAt: new Date(),
    }
    
    return NextResponse.json({
      post: blogPosts[postIndex],
      message: "Blog post updated successfully"
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Update blog post error:", error)
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
    const postId = params.id
    
    // Find post
    const postIndex = blogPosts.findIndex(p => p.id === postId)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // Remove post
    blogPosts.splice(postIndex, 1)
    
    return NextResponse.json({
      message: "Blog post deleted successfully"
    })
    
  } catch (error) {
    console.error("Delete blog post error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
