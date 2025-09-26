import mongoose, { Document, Schema } from 'mongoose'

export interface IBlogPost extends Document {
  _id: string
  title: string
  content: string
  excerpt: string
  author: string
  authorId: string
  thumbnail: string
  category: string
  tags: string[]
  publishedAt: Date
  updatedAt: Date
  isPublished: boolean
  views: number
  likes: number
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: {
    type: String,
    required: [true, 'Blog post title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog post content is required']
  },
  excerpt: {
    type: String,
    required: [true, 'Blog post excerpt is required'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  authorId: {
    type: String,
    required: [true, 'Author ID is required']
  },
  thumbnail: {
    type: String,
    required: [true, 'Blog post thumbnail is required'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v) || v.startsWith('/')
      },
      message: 'Thumbnail must be a valid URL or path'
    }
  },
  category: {
    type: String,
    required: [true, 'Blog post category is required'],
    maxlength: [100, 'Category cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  }
}, {
  timestamps: true
})

// Indexes for faster queries
BlogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' })
BlogPostSchema.index({ category: 1 })
BlogPostSchema.index({ authorId: 1 })
BlogPostSchema.index({ isPublished: 1 })
BlogPostSchema.index({ publishedAt: -1 })
BlogPostSchema.index({ views: -1 })
BlogPostSchema.index({ likes: -1 })
BlogPostSchema.index({ tags: 1 })

// Transform the output to match frontend expectations
BlogPostSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
})

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)
