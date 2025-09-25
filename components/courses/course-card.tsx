"use client"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Star, BookOpen } from "lucide-react"
import type { Course } from "@/lib/types"
import { useApp } from "@/contexts/app-context"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const { state, dispatch } = useApp()

  const isEnrolled = state.enrollments.some(
    (enrollment) => enrollment.courseId === course.id && enrollment.userId === state.user?.id,
  )

  const handleEnroll = async () => {
    if (!state.user) {
      window.location.href = "/auth/login"
      return
    }

    // Mock enrollment
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
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4">
            <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-black/50 text-white">
              ${course.price}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 text-balance">{course.title}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{course.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-xs">{course.instructor.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{course.instructor}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.enrolledStudents}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons.length} lessons</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="w-full space-y-2">
          {isEnrolled ? (
            <Button asChild className="w-full">
              <Link href={`/courses/${course.id}/learn`}>Continue Learning</Link>
            </Button>
          ) : (
            <Button onClick={handleEnroll} className="w-full">
              Enroll Now
            </Button>
          )}
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href={`/courses/${course.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
