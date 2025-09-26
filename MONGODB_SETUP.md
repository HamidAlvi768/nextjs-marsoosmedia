# MongoDB Integration Setup Guide

## Overview
This project has been successfully integrated with MongoDB using Mongoose. All in-memory storage has been replaced with persistent database operations.

## Prerequisites
1. MongoDB installed locally or access to MongoDB Atlas
2. Node.js and npm installed
3. Environment variables configured

## Setup Instructions

### 1. Install MongoDB (if not already installed)

#### Option A: Local MongoDB Installation
```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB service
# Windows
net start MongoDB

# macOS/Linux
brew services start mongodb/brew/mongodb-community
# or
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/edublog

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edublog?retryWrites=true&w=majority
```

### 3. Database Models

The following Mongoose models have been created:

- **User** (`lib/models/User.ts`) - User authentication and profiles
- **Course** (`lib/models/Course.ts`) - Course information and lessons
- **BlogPost** (`lib/models/BlogPost.ts`) - Blog posts and articles
- **Enrollment** (`lib/models/Enrollment.ts`) - User course enrollments
- **Comment** (`lib/models/Comment.ts`) - Blog post comments

### 4. Database Connection

The connection is handled by `lib/mongodb.ts` with:
- Connection caching for development
- Automatic reconnection
- Error handling

### 5. API Routes Updated

All API routes now use MongoDB:

- `/api/auth/*` - User authentication
- `/api/courses/*` - Course management
- `/api/blog/*` - Blog post management
- `/api/enrollments/*` - Enrollment tracking
- `/api/blog/[id]/comments/*` - Comment system

### 6. Demo Data Initialization

The application automatically initializes demo data when the database is empty:
- Demo users (admin, instructor, student)
- Sample courses
- Example blog posts
- Demo enrollments
- Sample comments

## Testing the Integration

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test API Endpoints
Use the provided Postman collection or test manually:

```bash
# Test user registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"student"}'

# Test course listing
curl http://localhost:3000/api/courses

# Test blog posts
curl http://localhost:3000/api/blog
```

### 3. Verify Database
Connect to MongoDB and check collections:

```bash
# Connect to MongoDB
mongosh

# Switch to database
use edublog

# List collections
show collections

# Check documents
db.users.find()
db.courses.find()
db.blogposts.find()
```

## Features

### Data Persistence
- All data is now stored in MongoDB
- Data persists between server restarts
- Automatic demo data seeding

### Advanced Queries
- Full-text search for courses and blog posts
- Filtering by category, level, status
- Sorting by date, views, likes, etc.
- Pagination support

### Data Validation
- Mongoose schema validation
- Zod input validation
- Type safety with TypeScript

### Performance Optimizations
- Database indexes for faster queries
- Connection pooling
- Efficient query patterns

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure MongoDB is running
   - Check connection string format
   - Verify network access for Atlas

2. **Authentication Failed**
   - Check username/password in connection string
   - Verify database user permissions

3. **Schema Validation Errors**
   - Check required fields
   - Verify data types
   - Review validation rules

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=mongoose:*
```

## Production Considerations

1. **Security**
   - Use environment variables for credentials
   - Enable MongoDB authentication
   - Use SSL/TLS connections

2. **Performance**
   - Configure connection pooling
   - Add database indexes
   - Monitor query performance

3. **Backup**
   - Set up regular backups
   - Test restore procedures
   - Monitor disk space

## Next Steps

1. **Password Hashing**
   - Implement bcrypt for password hashing
   - Add password reset functionality

2. **File Uploads**
   - Add image upload for avatars and thumbnails
   - Implement file storage (AWS S3, Cloudinary)

3. **Real-time Features**
   - Add WebSocket support for live comments
   - Implement real-time notifications

4. **Advanced Features**
   - Add course progress tracking
   - Implement rating and review system
   - Add search and filtering UI

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review MongoDB documentation
3. Check Mongoose documentation
4. Create an issue in the project repository
