import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/mongodb"
import BlogPost from "@/lib/models/BlogPost"

// Validation schema for blog post creation
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  author: z.string().min(1, "Author is required"),
  authorId: z.string().min(1, "Author ID is required"),
  thumbnail: z.string().url().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
})

// Initialize demo blog posts if database is empty
async function initializeDemoBlogPosts() {
  const blogPostCount = await BlogPost.countDocuments()
  if (blogPostCount === 0) {
    const demoBlogPosts = [
      {
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
        isPublished: true,
        views: 1500,
        likes: 89,
      },
      {
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
        isPublished: true,
        views: 2100,
        likes: 156,
      },
    ]
    
    await BlogPost.insertMany(demoBlogPosts)
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    await initializeDemoBlogPosts()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const published = searchParams.get("published")
    const sortBy = searchParams.get("sortBy") || "newest"

    // Build query
    let query: any = {}

    // Apply filters
    if (category && category !== "All Categories") {
      query.category = category
    }

    if (published === "true") {
      query.isPublished = true
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Build sort
    let sort: any = {}
    switch (sortBy) {
      case "newest":
        sort.publishedAt = -1
        break
      case "oldest":
        sort.publishedAt = 1
        break
      case "views":
        sort.views = -1
        break
      case "likes":
        sort.likes = -1
        break
      default:
        sort.publishedAt = -1
    }

    const posts = await BlogPost.find(query).sort(sort)

    return NextResponse.json({
      posts,
      total: posts.length
    })
  } catch (error) {
    console.error("Get blog posts error:", error)
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
    const validatedData = blogPostSchema.parse(body)
    
    // Create new blog post
    const newPost = new BlogPost({
      ...validatedData,
      publishedAt: validatedData.isPublished ? new Date() : new Date(),
      views: 0,
      likes: 0,
    })
    
    // Save blog post to database
    const savedPost = await newPost.save()
    
    return NextResponse.json({
      post: savedPost,
      message: "Blog post created successfully"
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Create blog post error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
