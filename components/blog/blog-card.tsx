"use client"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Eye, Heart, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/types"

interface BlogCardProps {
  post: BlogPost
  variant?: "default" | "featured"
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (variant === "featured") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{post.category}</Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-balance line-clamp-2">{post.title}</h2>
              <p className="text-muted-foreground text-pretty line-clamp-3">{post.excerpt}</p>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{post.author}</span>
              </div>
              <Button asChild>
                <Link href={`/blog/${post.id}`}>
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <img
          src={post.thumbnail || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>

      <CardContent className="flex-1 p-6 flex flex-col">
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{post.category}</Badge>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>

          <h3 className="font-semibold text-lg line-clamp-2 text-balance">{post.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-3 text-pretty">{post.excerpt}</p>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-xs">{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{post.author}</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/blog/${post.id}`}>
              Read More
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
