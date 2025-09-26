"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/contexts/app-context"
import { MessageCircle, Reply, Trash2 } from "lucide-react"
import type { Comment } from "@/lib/types"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { state, dispatch } = useApp()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(false)

  // Get comments for this post
  const postComments = state.comments.filter((comment) => comment.postId === postId && !comment.parentId)

  // Get replies for a comment
  const getReplies = (commentId: string) => {
    return state.comments.filter((comment) => comment.parentId === commentId)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!state.user || !newComment.trim()) return

    setLoading(true)
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        postId,
        userId: state.user.id,
        userName: state.user.name,
        userAvatar: state.user.avatar,
        content: newComment.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dispatch({ type: "ADD_COMMENT", payload: comment })
      setNewComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!state.user || !replyText.trim()) return

    setLoading(true)
    try {
      const reply: Comment = {
        id: Date.now().toString(),
        postId,
        userId: state.user.id,
        userName: state.user.name,
        userAvatar: state.user.avatar,
        content: replyText.trim(),
        parentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dispatch({ type: "ADD_COMMENT", payload: reply })
      setReplyText("")
      setReplyingTo(null)
    } catch (error) {
      console.error("Failed to add reply:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      dispatch({ type: "DELETE_COMMENT", payload: commentId })
    }
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const replies = getReplies(comment.id)
    const canDelete = state.user && (state.user.id === comment.userId || state.user.role === "admin")

    return (
      <div className={`space-y-3 ${isReply ? "ml-8 pl-4 border-l-2 border-muted" : ""}`}>
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.userAvatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">{comment.userName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{comment.userName}</span>
              <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
            </div>

            <p className="text-sm text-pretty">{comment.content}</p>

            <div className="flex items-center space-x-2">
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="h-auto p-1 text-xs"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}

              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.id)}
                  className="h-auto p-1 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyText.trim() || loading}
                  >
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="space-y-3">
            {replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({postComments.length})</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Comment Form */}
        {state.user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={state.user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">{state.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button type="submit" disabled={!newComment.trim() || loading}>
                  {loading ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground mb-4">Please sign in to leave a comment</p>
            <Button asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
          </div>
        )}

        <Separator />

        {/* Comments List */}
        <div className="space-y-6">
          {postComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            postComments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
}
