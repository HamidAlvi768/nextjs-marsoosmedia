import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'student' | 'instructor'
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'instructor'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: '/placeholder.svg?height=40&width=40'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true
})

// Index for faster queries
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

// Transform the output to match frontend expectations
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.password
    return ret
  }
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
