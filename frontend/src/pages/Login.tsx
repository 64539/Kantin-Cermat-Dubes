import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Utensils, ChefHat, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import "./Login.css"

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Ambil API URL dari env atau default ke localhost:3000
  const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
  // Bersihkan path '/api' di akhir jika ada, karena endpoint otentikasi di NestJS berjalan di root
  const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl.substring(0, rawApiUrl.length - 4) : rawApiUrl

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      })

      const data = response.data

      // Simpan token dan info user ke localStorage
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Login Berhasil",
        description: `Selamat datang kembali, ${data.user.name}!`,
      })

      // Arahkan ke dashboard
      navigate("/dashboard")
    } catch (error: any) {
      // Dapatkan pesan error dari response backend
      const message = error.response?.data?.message || error.message || "Terjadi kesalahan sistem, silakan coba lagi."
      
      toast({
        title: "Login Gagal",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* ─── Left Panel ─── */}
      <div className="login-left">
        {/* Animated blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* Floating icons */}
        <div className="float-icon float-icon-1">
          <ChefHat size={22} />
        </div>
        <div className="float-icon float-icon-2">
          <Utensils size={18} />
        </div>
        <div className="float-icon float-icon-3">
          <Star size={16} />
        </div>

        {/* Main content */}
        <div className="login-left-content">
          {/* Logo */}
          <div className="login-logo">
            <Utensils size={36} />
          </div>

          {/* Title */}
          <div className="login-brand">
            <h1>Kantin Cermat</h1>
            <span className="login-brand-sub">Dubes</span>
          </div>

          <p className="login-tagline">
            Cerdas Mengelola, Cepat Melayani.
          </p>
          <p className="login-desc">
            Sistem administrasi kantin digital yang modern — kelola menu, stok, dan pesanan dalam satu platform.
          </p>

          {/* Stats */}
          <div className="login-stats">
            <div className="login-stat">
              <span className="login-stat-num">99%</span>
              <span className="login-stat-label">Akurasi Stok</span>
            </div>
            <div className="login-stat-divider" />
            <div className="login-stat">
              <span className="login-stat-num">3x</span>
              <span className="login-stat-label">Lebih Cepat</span>
            </div>
            <div className="login-stat-divider" />
            <div className="login-stat">
              <span className="login-stat-num">24/7</span>
              <span className="login-stat-label">Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="login-right">
        <div className="login-form-card">
          {/* Header */}
          <div className="login-form-header">
            <div className="login-form-icon">
              <Utensils size={24} />
            </div>
            <h2>Selamat Datang</h2>
            <p>Masuk ke dasbor pengelolaan kantin Anda</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="admin@sekolah.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`login-submit-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-spinner" />
              ) : (
                "Masuk ke Sistem"
              )}
            </button>
          </form>
          
          <p className="login-footer-note">
            Hanya akun yang telah terdaftar yang dapat mengakses sistem ini.
          </p>
        </div>
      </div>
    </div>
  )
}
