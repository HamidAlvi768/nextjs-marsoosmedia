"use client"

import { useApp } from "@/contexts/app-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  MessageSquare,
  Star
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { state } = useApp()

  // Get user's enrollments
  const userEnrollments = state.enrollments.filter(
    (enrollment) => enrollment.userId === state.user?.id
  )

  // Get user's comments
  const userComments = state.comments.filter(
    (comment) => comment.userId === state.user?.id
  )

  // Calculate stats
  const totalCourses = userEnrollments.length
  const completedCourses = userEnrollments.filter(
    (enrollment) => enrollment.status === "completed"
  ).length
  const inProgressCourses = userEnrollments.filter(
    (enrollment) => enrollment.status === "in-progress"
  ).length
  const averageProgress = userEnrollments.length > 0 
    ? Math.round(userEnrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / userEnrollments.length)
    : 0

  // Get recent activity
  const recentEnrollments = userEnrollments
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 3)

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {state.user?.name}!</h1>
              <p className="text-muted-foreground">
                Here's your learning progress and recent activity
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="capitalize">
                {state.user?.role}
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {inProgressCourses} in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageProgress}%</div>
                <Progress value={averageProgress} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userComments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total interactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Courses</CardTitle>
                    <CardDescription>Your latest course enrollments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentEnrollments.length > 0 ? (
                        recentEnrollments.map((enrollment) => {
                          const course = state.courses.find((c) => c.id === enrollment.courseId)
                          return (
                            <div key={enrollment.id} className="flex items-center space-x-4">
                              <div className="flex-1">
                                <h4 className="font-medium">{course?.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {course?.instructor} • {course?.duration}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Progress value={enrollment.progress} className="flex-1" />
                                  <span className="text-sm text-muted-foreground">
                                    {enrollment.progress}%
                                  </span>
                                </div>
                              </div>
                              <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>
                                {enrollment.status}
                              </Badge>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No courses enrolled yet</p>
                          <Button asChild className="mt-4">
                            <Link href="/courses">Browse Courses</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Continue your learning journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button asChild className="w-full justify-start">
                        <Link href="/courses">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Browse All Courses
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/blog">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Read Latest Blog Posts
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/profile">
                          <Users className="mr-2 h-4 w-4" />
                          Update Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>Track your progress across all enrolled courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userEnrollments.length > 0 ? (
                      userEnrollments.map((enrollment) => {
                        const course = state.courses.find((c) => c.id === enrollment.courseId)
                        return (
                          <div key={enrollment.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold">{course?.title}</h3>
                                  <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>
                                    {enrollment.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{course?.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-center">
                                    <Users className="mr-1 h-3 w-3" />
                                    {course?.instructor}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {course?.duration}
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="mr-1 h-3 w-3" />
                                    {course?.rating}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Progress value={enrollment.progress} className="flex-1" />
                                  <span className="text-sm font-medium">{enrollment.progress}%</span>
                                </div>
                              </div>
                              <Button asChild size="sm">
                                <Link href={`/courses/${course?.id}`}>
                                  {enrollment.status === "completed" ? "Review" : "Continue"}
                                  <PlayCircle className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No courses enrolled</h3>
                        <p className="text-muted-foreground mb-4">
                          Start your learning journey by enrolling in a course
                        </p>
                        <Button asChild>
                          <Link href="/courses">Browse Courses</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest learning activities and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userComments.length > 0 ? (
                      userComments
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5)
                        .map((comment) => {
                          const post = state.blogPosts.find((p) => p.id === comment.postId)
                          return (
                            <div key={comment.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium">Commented on</span>{" "}
                                  <Link href={`/blog/${post?.id}`} className="text-primary hover:underline">
                                    {post?.title}
                                  </Link>
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          )
                        })
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
