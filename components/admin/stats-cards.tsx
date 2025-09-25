"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/contexts/app-context"
import { BookOpen, FileText, Users, GraduationCap, TrendingUp, MessageSquare } from "lucide-react"

export function StatsCards() {
  const { state } = useApp()

  const stats = [
    {
      title: "Total Courses",
      value: state.courses.length,
      icon: BookOpen,
      description: "Active courses",
      trend: "+12%",
    },
    {
      title: "Blog Posts",
      value: state.blogPosts.filter((post) => post.isPublished).length,
      icon: FileText,
      description: "Published posts",
      trend: "+8%",
    },
    {
      title: "Total Enrollments",
      value: state.enrollments.length,
      icon: GraduationCap,
      description: "Student enrollments",
      trend: "+23%",
    },
    {
      title: "Comments",
      value: state.comments.length,
      icon: MessageSquare,
      description: "Total comments",
      trend: "+15%",
    },
    {
      title: "Total Revenue",
      value: `$${state.enrollments
        .reduce((total, enrollment) => {
          const course = state.courses.find((c) => c.id === enrollment.courseId)
          return total + (course?.price || 0)
        }, 0)
        .toLocaleString()}`,
      icon: TrendingUp,
      description: "From course sales",
      trend: "+18%",
    },
    {
      title: "Active Users",
      value: "1,234",
      icon: Users,
      description: "Registered users",
      trend: "+7%",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.trend}</span> {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
