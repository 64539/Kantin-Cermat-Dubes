import axios from "axios"

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl.substring(0, rawApiUrl.length - 4) : rawApiUrl

export const api = axios.create({
  baseURL: API_URL,
})

// Request Interceptor: Inject JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
