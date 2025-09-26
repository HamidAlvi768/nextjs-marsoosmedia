import mongoose, { Document, Schema } from 'mongoose'

export interface ILesson {
  _id?: string
  title: string
  description: string
  content: string
  videoUrl?: string
  duration: number
  order: number
  isCompleted?: boolean
}

export interface ICourse extends Document {
  _id: string
  title: string
  description: string
  instructor: string
  instructorId: string
  price: number
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  thumbnail: string
  category: string
  lessons: ILesson[]
  enrolledStudents: number
  rating: number
  createdAt: Date
  updatedAt: Date
}

const LessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    maxlength: [200, 'Lesson title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    maxlength: [500, 'Lesson description cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required']
  },
  videoUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v)
      },
      message: 'Video URL must be a valid URL'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Lesson duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  order: {
    type: Number,
    required: [true, 'Lesson order is required'],
    min: [1, 'Order must be at least 1']
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { _id: true })

const CourseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Course description cannot exceed 1000 characters']
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required'],
    maxlength: [100, 'Instructor name cannot exceed 100 characters']
  },
  instructorId: {
    type: String,
    required: [true, 'Instructor ID is required']
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Course duration is required'],
    maxlength: [50, 'Duration cannot exceed 50 characters']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Course level is required']
  },
  thumbnail: {
    type: String,
    required: [true, 'Course thumbnail is required'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v) || v.startsWith('/')
      },
      message: 'Thumbnail must be a valid URL or path'
    }
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    maxlength: [100, 'Category cannot exceed 100 characters']
  },
  lessons: [LessonSchema],
  enrolledStudents: {
    type: Number,
    default: 0,
    min: [0, 'Enrolled students cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  }
}, {
  timestamps: true
})

// Indexes for faster queries
CourseSchema.index({ title: 'text', description: 'text' })
CourseSchema.index({ category: 1 })
CourseSchema.index({ level: 1 })
CourseSchema.index({ instructorId: 1 })
CourseSchema.index({ price: 1 })
CourseSchema.index({ rating: -1 })
CourseSchema.index({ enrolledStudents: -1 })

// Transform the output to match frontend expectations
CourseSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
})

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)
