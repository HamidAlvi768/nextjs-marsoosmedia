"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CourseCard } from "@/components/courses/course-card"
import { useApp } from "@/contexts/app-context"
import { BookOpen, Users, Award, TrendingUp, ArrowRight } from "lucide-react"

export default function HomePage() {
  const { state } = useApp()

  // Get featured courses (first 3)
  const featuredCourses = state.courses.slice(0, 3)

  // Get recent blog posts (first 2)
  const recentPosts = state.blogPosts.slice(0, 2)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Learn, Grow, and
              <span className="text-primary"> Excel</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              Discover world-class courses and insightful articles from industry experts. Start your learning journey
              today and unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/courses">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Courses
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/blog">
                  Read Blog
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{state.courses.length}+</div>
              <div className="text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-balance mb-4">Featured Courses</h2>
            <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
              Discover our most popular courses, carefully selected to help you achieve your learning goals.
            </p>
          </div>

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No courses available yet.</p>
            </div>
          )}

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/courses">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-balance mb-4">Latest from Our Blog</h2>
            <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and insights from our expert contributors.
            </p>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {recentPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <img
                      src={post.thumbnail || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-sm text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-semibold text-lg line-clamp-2 text-balance">{post.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-muted-foreground">By {post.author}</span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${post.id}`}>
                            Read More
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No blog posts available yet.</p>
            </div>
          )}

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-balance mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-pretty mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who are already advancing their careers with our courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
