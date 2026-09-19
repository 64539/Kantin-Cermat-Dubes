import axios from "axios"

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
// Normalize URL — remove trailing /api if present since all routes already include it
const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl.slice(0, -4) : rawApiUrl

export const api = axios.create({
  baseURL: API_URL,
})

// ─────────────────────────────────────────────────────────────────────────────
// Request Interceptor: Inject JWT Access Token
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─────────────────────────────────────────────────────────────────────────────
// Response Interceptor: Silent Token Refresh
//
// Sebelumnya: 401 langsung redirect ke /login, memaksa user login ulang.
// Sekarang:
// 1. Jika access_token expired (401), coba refresh dengan refresh_token.
// 2. Jika refresh berhasil: simpan access_token baru, ulangi request original.
// 3. Jika refresh gagal (refresh_token juga expired/invalid): baru logout.
// ─────────────────────────────────────────────────────────────────────────────
let isRefreshing = false
let failedRequestsQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Hanya handle 401 dan hanya sekali per request (cegah infinite loop)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refresh_token")

      // Jika tidak ada refresh token, langsung logout
      if (!refreshToken) {
        return forceLogout()
      }

      // Jika sedang dalam proses refresh, antri request ini
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Kirim refresh token ke endpoint /auth/refresh
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        )

        const newAccessToken: string = data.access_token
        localStorage.setItem("access_token", newAccessToken)

        // Selesaikan semua request yang antri dengan token baru
        failedRequestsQueue.forEach((req) => req.resolve(newAccessToken))
        failedRequestsQueue = []

        // Ulangi request original dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh gagal — logout user
        failedRequestsQueue.forEach((req) => req.reject(refreshError))
        failedRequestsQueue = []
        return forceLogout()
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function forceLogout() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
  window.location.href = "/login"
  return Promise.reject(new Error("Session berakhir. Silakan login kembali."))
}
