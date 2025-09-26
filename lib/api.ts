import axios from "axios"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add timestamp for cache busting
    config.params = {
      ...config.params,
      _t: Date.now(),
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem("authToken")
      window.location.href = "/auth/login"
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error("Access denied")
    } else if (error.response?.status >= 500) {
      // Server error
      console.error("Server error occurred")
    }

    return Promise.reject(error)
  },
)

// API functions
export const authAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),

  register: (userData: { name: string; email: string; password: string; role?: string }) => api.post("/auth/register", userData),

  logout: () => api.post("/auth/logout"),

  getProfile: () => api.get("/auth/profile"),

  updateProfile: (userData: any) => api.put("/auth/profile", userData),
}

export const coursesAPI = {
  getAll: () => api.get("/courses"),

  getById: (id: string) => api.get(`/courses/${id}`),

  create: (courseData: any) => api.post("/courses", courseData),

  update: (id: string, courseData: any) => api.put(`/courses/${id}`, courseData),

  delete: (id: string) => api.delete(`/courses/${id}`),

  enroll: (courseId: string) => api.post(`/courses/${courseId}/enroll`),

  getEnrollments: () => api.get("/enrollments"),
}

export const blogAPI = {
  getAll: () => api.get("/blog"),

  getById: (id: string) => api.get(`/blog/${id}`),

  create: (postData: any) => api.post("/blog", postData),

  update: (id: string, postData: any) => api.put(`/blog/${id}`, postData),

  delete: (id: string) => api.delete(`/blog/${id}`),

  getComments: (postId: string) => api.get(`/blog/${postId}/comments`),

  addComment: (postId: string, commentData: any) => api.post(`/blog/${postId}/comments`, commentData),

  updateComment: (postId: string, commentId: string, commentData: any) =>
    api.put(`/blog/${postId}/comments/${commentId}`, commentData),

  deleteComment: (postId: string, commentId: string) => api.delete(`/blog/${postId}/comments/${commentId}`),
}

export default api
