"use client"
import { StatsCards } from "@/components/admin/stats-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/contexts/app-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Eye, Edit } from "lucide-react"

export default function AdminDashboard() {
  const { state } = useApp()

  // Get recent enrollments
  const recentEnrollments = state.enrollments
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 5)

  // Get recent blog posts
  const recentPosts = state.blogPosts
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // Get recent comments
  const recentComments = state.comments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Enrollments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/enrollments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnrollments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No enrollments yet</p>
              ) : (
                recentEnrollments.map((enrollment) => {
                  const course = state.courses.find((c) => c.id === enrollment.courseId)
                  return (
                    <div key={enrollment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{course?.title || "Unknown Course"}</p>
                        <p className="text-sm text-muted-foreground">{enrollment.enrolledAt.toLocaleDateString()}</p>
                      </div>
                      <Badge variant="secondary">${course?.price || 0}</Badge>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Blog Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Blog Posts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/blog">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No posts yet</p>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{post.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={post.isPublished ? "default" : "secondary"}>
                          {post.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{post.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Comments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/comments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No comments yet</p>
              ) : (
                recentComments.map((comment) => {
                  const post = state.blogPosts.find((p) => p.id === comment.postId)
                  return (
                    <div key={comment.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{comment.content}</p>
                        <p className="text-xs text-muted-foreground">
                          On: <span className="font-medium">{post?.title || "Unknown Post"}</span>
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${comment.postId}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
