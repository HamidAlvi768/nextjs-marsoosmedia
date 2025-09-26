# EduPlatform API Testing with Postman

This directory contains Postman collections and environment files for testing the EduPlatform API endpoints.

## Files

- `EduPlatform-API-Tests.postman_collection.json` - Complete API testing collection
- `EduPlatform-Environment.postman_environment.json` - Environment variables for different environments

## Setup Instructions

### 1. Import the Collection

1. Open Postman
2. Click "Import" button
3. Select `EduPlatform-API-Tests.postman_collection.json`
4. The collection will be imported with all API endpoints

### 2. Import the Environment (Optional)

1. Click "Import" button
2. Select `EduPlatform-Environment.postman_environment.json`
3. Select the environment from the dropdown (e.g., "Development")

### 3. Start the Development Server

Make sure your Next.js development server is running:

```bash
npm run dev
```

The server should be running on `http://localhost:3001` (or the port shown in your terminal).

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Courses
- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/{id}` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course
- `POST /api/courses/{id}/enroll` - Enroll in course

### Enrollments
- `GET /api/enrollments` - Get all enrollments (with filtering)

### Blog Posts
- `GET /api/blog` - Get all blog posts (with filtering and sorting)
- `GET /api/blog/{id}` - Get blog post by ID
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/{id}` - Update blog post
- `DELETE /api/blog/{id}` - Delete blog post

### Comments
- `GET /api/blog/{id}/comments` - Get comments for a blog post
- `POST /api/blog/{id}/comments` - Add comment to blog post
- `PUT /api/blog/{id}/comments/{commentId}` - Update comment
- `DELETE /api/blog/{id}/comments/{commentId}` - Delete comment

## Testing Workflow

### 1. Authentication Flow
1. Start with "Register User" or "Login User"
2. The auth token will be automatically saved to collection variables
3. Use "Get Profile" to verify authentication
4. Test "Update Profile" to modify user data

### 2. Courses Flow
1. "Get All Courses" to see existing courses
2. "Create Course" to add a new course
3. "Get Course by ID" to view specific course
4. "Update Course" to modify course details
5. "Enroll in Course" to test enrollment functionality
6. "Delete Course" to remove the course

### 3. Blog Posts Flow
1. "Get All Blog Posts" to see existing posts
2. "Create Blog Post" to add a new post
3. "Get Blog Post by ID" to view specific post
4. "Update Blog Post" to modify post details
5. "Delete Blog Post" to remove the post

### 4. Comments Flow
1. "Get Comments for Blog Post" to see existing comments
2. "Add Comment to Blog Post" to add a new comment
3. "Update Comment" to modify comment content
4. "Delete Comment" to remove the comment

### 5. Error Testing
1. Test "Invalid Course ID" to see 404 response
2. Test "Invalid Blog Post ID" to see 404 response
3. Test "Invalid Registration Data" to see validation errors
4. Test "Invalid Login Credentials" to see authentication errors
5. Test "Unauthorized Profile Access" to see 401 response

## Collection Variables

The collection automatically manages these variables:

- `baseUrl` - API base URL (default: http://localhost:3001)
- `authToken` - JWT token for authenticated requests
- `userId` - Current user ID
- `courseId` - Course ID for testing
- `blogPostId` - Blog post ID for testing
- `commentId` - Comment ID for testing

## Demo Users

The API includes these demo users for testing:

- **Admin**: `admin@example.com` / `password123`
- **Instructor**: `instructor@example.com` / `password123`
- **Student**: `student@example.com` / `password123`

## Filtering and Search

### Courses
- `category` - Filter by category (e.g., "Web Development")
- `level` - Filter by level (e.g., "intermediate")
- `search` - Search in title, description, or instructor

### Blog Posts
- `category` - Filter by category (e.g., "Technology")
- `published` - Filter by published status (true/false)
- `sortBy` - Sort by: "newest", "oldest", "views", "likes"
- `search` - Search in title, content, excerpt, author, or tags

### Enrollments
- `userId` - Filter by user ID
- `courseId` - Filter by course ID

## Response Examples

### Successful Registration
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

### Course List
```json
{
  "courses": [
    {
      "id": "1",
      "title": "Complete React Development",
      "description": "Learn React from basics to advanced concepts...",
      "instructor": "John Doe",
      "price": 99.99,
      "level": "intermediate",
      "category": "Web Development",
      "enrolledStudents": 1250,
      "rating": 4.8
    }
  ],
  "total": 1
}
```

## Troubleshooting

### Common Issues

1. **Connection Refused**: Make sure the development server is running
2. **404 Errors**: Check that the API routes are properly implemented
3. **Authentication Errors**: Ensure you're logged in and the token is valid
4. **Validation Errors**: Check the request body format and required fields

### Debug Tips

1. Check the Postman Console for detailed error messages
2. Verify the `baseUrl` variable is correct
3. Ensure the auth token is being saved after login
4. Check the Network tab in browser dev tools for additional details

## Contributing

When adding new API endpoints:

1. Add the new request to the appropriate folder in the collection
2. Include proper error testing
3. Update this README with the new endpoint documentation
4. Test all CRUD operations if applicable
