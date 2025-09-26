import mongoose, { Document, Schema } from 'mongoose'

export interface IEnrollment extends Document {
  _id: string
  userId: string
  courseId: string
  progress: number
  completedLessons: string[]
  enrolledAt: Date
  completedAt?: Date
  status: 'in-progress' | 'completed' | 'paused'
  createdAt: Date
  updatedAt: Date
}

const EnrollmentSchema = new Schema<IEnrollment>({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  courseId: {
    type: String,
    required: [true, 'Course ID is required']
  },
  progress: {
    type: Number,
    default: 0,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100']
  },
  completedLessons: [{
    type: String
  }],
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'paused'],
    default: 'in-progress'
  }
}, {
  timestamps: true
})

// Indexes for faster queries
EnrollmentSchema.index({ userId: 1 })
EnrollmentSchema.index({ courseId: 1 })
EnrollmentSchema.index({ status: 1 })
EnrollmentSchema.index({ enrolledAt: -1 })
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true }) // Prevent duplicate enrollments

// Transform the output to match frontend expectations
EnrollmentSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
})

export default mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema)
