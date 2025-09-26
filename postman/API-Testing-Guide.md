# EduPlatform API Testing Guide

This guide provides comprehensive instructions for testing the EduPlatform API using Postman.

## Quick Start

1. **Import the Collection**: Import `EduPlatform-API-Tests.postman_collection.json` into Postman
2. **Import the Environment**: Import `EduPlatform-Environment.postman_environment.json` (optional)
3. **Start the Server**: Run `npm run dev` in your project directory
4. **Begin Testing**: Start with the Authentication flow

## API Endpoints Reference

### Base URL
```
http://localhost:3001
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "user": {
    "id": "1234567890",
    "name": "Test User",
    "email": "test@example.com",
    "role": "student",
    "avatar": "/placeholder.svg?height=40&width=40",
    "bio": "",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-1234567890-1234567890",
  "message": "Registration successful"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "Updated bio"
}
```

### Courses Endpoints

#### Get All Courses
```http
GET /api/courses
```

**Query Parameters:**
- `category` - Filter by category (e.g., "Web Development")
- `level` - Filter by level (e.g., "intermediate")
- `search` - Search in title, description, or instructor

**Example:**
```http
GET /api/courses?category=Web Development&level=intermediate&search=React
```

#### Get Course by ID
```http
GET /api/courses/{id}
```

#### Create Course
```http
POST /api/courses
Content-Type: application/json

{
  "title": "Advanced JavaScript",
  "description": "Master advanced JavaScript concepts...",
  "instructor": "John Doe",
  "instructorId": "1",
  "price": 149.99,
  "duration": "10 weeks",
  "level": "advanced",
  "thumbnail": "/placeholder.svg?height=300&width=400&text=JavaScript+Course",
  "category": "Programming",
  "lessons": [
    {
      "id": "1",
      "courseId": "3",
      "title": "Introduction to Advanced JavaScript",
      "description": "Getting started with advanced concepts",
      "content": "JavaScript is a powerful language...",
      "duration": 60,
      "order": 1
    }
  ]
}
```

#### Update Course
```http
PUT /api/courses/{id}
Content-Type: application/json

{
  "title": "Updated Course Title",
  "price": 129.99
}
```

#### Enroll in Course
```http
POST /api/courses/{id}/enroll
Content-Type: application/json

{
  "userId": "user-id-here"
}
```

#### Delete Course
```http
DELETE /api/courses/{id}
```

### Enrollments Endpoints

#### Get All Enrollments
```http
GET /api/enrollments
```

**Query Parameters:**
- `userId` - Filter by user ID
- `courseId` - Filter by course ID

**Example:**
```http
GET /api/enrollments?userId=123&courseId=456
```

### Blog Posts Endpoints

#### Get All Blog Posts
```http
GET /api/blog
```

**Query Parameters:**
- `category` - Filter by category (e.g., "Technology")
- `published` - Filter by published status (true/false)
- `sortBy` - Sort by: "newest", "oldest", "views", "likes"
- `search` - Search in title, content, excerpt, author, or tags

**Example:**
```http
GET /api/blog?category=Technology&published=true&sortBy=newest&search=React
```

#### Get Blog Post by ID
```http
GET /api/blog/{id}
```

#### Create Blog Post
```http
POST /api/blog
Content-Type: application/json

{
  "title": "Understanding React Server Components",
  "content": "React Server Components represent a new paradigm...",
  "excerpt": "Learn about React Server Components...",
  "author": "John Doe",
  "authorId": "1",
  "thumbnail": "/placeholder.svg?height=400&width=600&text=React+Server+Components",
  "category": "Technology",
  "tags": ["react", "server-components", "nextjs", "performance"],
  "isPublished": true
}
```

#### Update Blog Post
```http
PUT /api/blog/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Blog Post
```http
DELETE /api/blog/{id}
```

### Comments Endpoints

#### Get Comments for Blog Post
```http
GET /api/blog/{id}/comments
```

#### Add Comment to Blog Post
```http
POST /api/blog/{id}/comments
Content-Type: application/json

{
  "userId": "user-id-here",
  "userName": "User Name",
  "userAvatar": "/placeholder.svg?height=40&width=40",
  "content": "This is a great article!"
}
```

#### Update Comment
```http
PUT /api/blog/{id}/comments/{commentId}
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

#### Delete Comment
```http
DELETE /api/blog/{id}/comments/{commentId}
```

## Testing Scenarios

### 1. Complete User Journey

1. **Register** a new user
2. **Login** with the new user
3. **Get Profile** to verify authentication
4. **Browse Courses** to see available courses
5. **Enroll** in a course
6. **Check Enrollments** to verify enrollment
7. **Read Blog Posts** to see content
8. **Add Comment** to a blog post
9. **Update Comment** to modify content
10. **Delete Comment** to remove it

### 2. Admin Operations

1. **Login** as admin (`admin@example.com` / `password123`)
2. **Create Course** to add new content
3. **Update Course** to modify details
4. **Create Blog Post** to add new content
5. **Update Blog Post** to modify content
6. **Delete Course** to remove content
7. **Delete Blog Post** to remove content

### 3. Error Handling

1. **Invalid Registration** - Test with invalid data
2. **Invalid Login** - Test with wrong credentials
3. **Unauthorized Access** - Test without auth token
4. **Invalid IDs** - Test with non-existent IDs
5. **Validation Errors** - Test with missing required fields

## Demo Data

The API includes pre-loaded demo data:

### Demo Users
- **Admin**: `admin@example.com` / `password123`
- **Instructor**: `instructor@example.com` / `password123`
- **Student**: `student@example.com` / `password123`

### Demo Courses
- **Complete React Development** (ID: 1)
- **Advanced TypeScript** (ID: 2)

### Demo Blog Posts
- **The Future of Web Development in 2024** (ID: 1)
- **Mastering React Hooks: A Complete Guide** (ID: 2)

### Demo Enrollments
- User 3 enrolled in Course 1 (75% progress)
- User 4 enrolled in Course 1 (100% progress, completed)
- User 3 enrolled in Course 2 (30% progress)

## Response Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized
- **404** - Not Found
- **500** - Internal Server Error

## Common Error Responses

### Validation Error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 6,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Password must be at least 6 characters",
      "path": ["password"]
    }
  ]
}
```

### Authentication Error
```json
{
  "error": "Invalid email or password"
}
```

### Not Found Error
```json
{
  "error": "Course not found"
}
```

## Tips for Effective Testing

1. **Use Collection Variables** - The collection automatically saves tokens and IDs
2. **Test Error Cases** - Always test invalid inputs and edge cases
3. **Verify Responses** - Check that response data matches expected format
4. **Test Authentication** - Ensure protected endpoints require valid tokens
5. **Test Filtering** - Verify that query parameters work correctly
6. **Test CRUD Operations** - Create, read, update, and delete resources
7. **Check Status Codes** - Verify correct HTTP status codes are returned

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure the development server is running
   - Check the port number (default: 3001)
   - Verify the baseUrl variable

2. **Authentication Errors**
   - Check if the auth token is being saved
   - Verify the token format (Bearer {token})
   - Ensure the user is logged in

3. **404 Errors**
   - Verify the endpoint URL is correct
   - Check if the resource ID exists
   - Ensure the API route is implemented

4. **Validation Errors**
   - Check required fields are provided
   - Verify data types match expected format
   - Ensure string lengths meet requirements

### Debug Steps

1. Check Postman Console for detailed error messages
2. Verify collection variables are set correctly
3. Test with a simple GET request first
4. Check the Network tab in browser dev tools
5. Verify the API route implementation in the codebase
