"use client"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/contexts/app-context"
import { Clock, Users, Star, BookOpen, Play, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function CourseDetailPage() {
  const params = useParams()
  const { state, dispatch } = useApp()
  const courseId = params.id as string

  const course = state.courses.find((c) => c.id === courseId)
  const isEnrolled = state.enrollments.some(
    (enrollment) => enrollment.courseId === courseId && enrollment.userId === state.user?.id,
  )

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Course Not Found</h1>
          <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleEnroll = async () => {
    if (!state.user) {
      window.location.href = "/auth/login"
      return
    }

    const newEnrollment = {
      id: Date.now().toString(),
      userId: state.user.id,
      courseId: course.id,
      progress: 0,
      completedLessons: [],
      enrolledAt: new Date(),
    }

    dispatch({ type: "ADD_ENROLLMENT", payload: newEnrollment })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
              <Badge variant="secondary">{course.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-balance mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground text-pretty">{course.description}</p>
          </div>

          {/* Course Image */}
          <div className="relative">
            <img
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            {isEnrolled && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Button asChild size="lg">
                  <Link href={`/courses/${course.id}/learn`}>
                    <Play className="mr-2 h-5 w-5" />
                    Continue Learning
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Course Stats */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.enrolledStudents} students</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating} rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.lessons.length} lessons</span>
            </div>
          </div>

          {/* Instructor */}
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{course.instructor}</h3>
                  <p className="text-sm text-muted-foreground">Expert in {course.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.lessons.length > 0 ? (
                  course.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        {isEnrolled ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{lesson.duration} min</div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Course content will be available soon.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold">${course.price}</div>
                <p className="text-sm text-muted-foreground">One-time payment</p>
              </div>

              {isEnrolled ? (
                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/courses/${course.id}/learn`}>
                      <Play className="mr-2 h-5 w-5" />
                      Continue Learning
                    </Link>
                  </Button>
                  <div className="text-center text-sm text-green-600 font-medium">✓ You're enrolled in this course</div>
                </div>
              ) : (
                <Button onClick={handleEnroll} className="w-full" size="lg">
                  Enroll Now
                </Button>
              )}

              <Separator className="my-6" />

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students</span>
                  <span>{course.enrolledStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lessons</span>
                  <span>{course.lessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{course.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
