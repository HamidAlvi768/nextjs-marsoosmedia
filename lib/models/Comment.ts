import mongoose, { Document, Schema } from 'mongoose'

export interface IComment extends Document {
  _id: string
  postId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  parentId?: string
  replies?: IComment[]
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>({
  postId: {
    type: String,
    required: [true, 'Post ID is required']
  },
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    maxlength: [100, 'User name cannot exceed 100 characters']
  },
  userAvatar: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v) || v.startsWith('/')
      },
      message: 'User avatar must be a valid URL or path'
    }
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [1000, 'Comment content cannot exceed 1000 characters']
  },
  parentId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

// Indexes for faster queries
CommentSchema.index({ postId: 1 })
CommentSchema.index({ userId: 1 })
CommentSchema.index({ parentId: 1 })
CommentSchema.index({ createdAt: -1 })

// Transform the output to match frontend expectations
CommentSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
})

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
