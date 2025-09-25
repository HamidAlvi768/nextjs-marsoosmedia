"use client"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CommentSection } from "@/components/blog/comment-section"
import { useApp } from "@/contexts/app-context"
import { Calendar, Eye, Heart, Share2, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

export default function BlogPostPage() {
  const params = useParams()
  const { state, dispatch } = useApp()
  const postId = params.id as string

  const post = state.blogPosts.find((p) => p.id === postId && p.isPublished)

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post Not Found</h1>
          <p className="text-muted-foreground mt-2">The blog post you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = state.blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category && p.isPublished)
    .slice(0, 3)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleLike = () => {
    const updatedPost = { ...post, likes: post.likes + 1 }
    dispatch({ type: "UPDATE_BLOG_POST", payload: updatedPost })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-3">
          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-balance mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground text-pretty mb-6">{post.excerpt}</p>

            {/* Author & Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div className="text-pretty whitespace-pre-wrap">{post.content}</div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-8">
            <Button onClick={handleLike} variant="outline" className="bg-transparent">
              <Heart className="mr-2 h-4 w-4" />
              Like ({post.likes})
            </Button>
            <Button onClick={handleShare} variant="outline" className="bg-transparent">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <Separator className="mb-8" />

          {/* Comments */}
          <CommentSection postId={post.id} />
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Author Card */}
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-2">{post.author}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Expert writer specializing in {post.category.toLowerCase()} topics.
                </p>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Follow
                </Button>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                        <img
                          src={relatedPost.thumbnail || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2 text-balance">{relatedPost.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(relatedPost.publishedAt)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
