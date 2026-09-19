import { useEffect, useState, useCallback, useRef } from "react"
import { Menu, Search, Bell, AlertTriangle, AlertCircle, ClipboardList } from "lucide-react"
import { api } from "@/lib/api"

interface LoggedInUser {
  id: number
  name: string
  email: string
  role: string
}

interface Notification {
  id: string
  title: string
  description: string
  type: "danger" | "warning" | "info"
}

// ─────────────────────────────────────────────────────────────────────────────
// POLLING CONFIG
// Sebelumnya: setInterval dengan interval tetap 20 detik, berjalan terus
// bahkan saat tab tidak aktif — membuang kuota network dan server resources.
//
// Sekarang:
// 1. Polling BERHENTI saat tab tidak aktif (visibilitychange API).
// 2. Polling RESUME segera saat tab kembali aktif.
// 3. Interval dapat diatur dari satu konstanta terpusat.
// ─────────────────────────────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 30_000 // 30 detik

export function Header({ setMobileOpen }: { setMobileOpen: (open: boolean) => void }) {
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  // Simpan referensi interval agar bisa di-clear dengan benar
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        setCurrentUser(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Gagal membaca data user dari localStorage", e)
    }
  }, [])

  const fetchNotifications = useCallback(async () => {
    // Jangan fetch jika tab sedang tidak visible (background tab)
    if (document.visibilityState !== "visible") return

    try {
      const [stocksRes, ordersRes] = await Promise.all([
        api.get("/stocks"),
        api.get("/orders"),
      ])

      const newNotifs: Notification[] = []

      // 1. Cek stok habis & menipis
      if (Array.isArray(stocksRes.data)) {
        stocksRes.data.forEach((s: any) => {
          if (s.stock === 0) {
            newNotifs.push({
              id: `stock-empty-${s.id}`,
              title: "Stok Habis!",
              description: `Stok menu "${s.name}" telah habis. Segera restock!`,
              type: "danger"
            })
          } else if (s.stock <= 5) {
            newNotifs.push({
              id: `stock-low-${s.id}`,
              title: "Stok Menipis",
              description: `Menu "${s.name}" hanya sisa ${s.stock} porsi.`,
              type: "warning"
            })
          }
        })
      }

      // 2. Cek pesanan baru (PENDING)
      if (Array.isArray(ordersRes.data)) {
        ordersRes.data.forEach((o: any) => {
          if (o.status === "PENDING") {
            newNotifs.push({
              id: `order-pending-${o.id}`,
              title: "Pesanan Pending",
              description: `Pesanan #${o.id} dari ${o.studentName || "Pelanggan Umum"} menunggu persetujuan.`,
              type: "info"
            })
          }
        })
      }

      setNotifications(newNotifs)
      setHasUnread(newNotifs.length > 0)
    } catch (e) {
      console.error("Gagal memuat notifikasi otomatis", e)
    }
  }, [])

  const startPolling = useCallback(() => {
    // Fetch segera saat dimulai
    fetchNotifications()
    // Kemudian set interval
    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS)
  }, [fetchNotifications])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    // Mulai polling saat komponen mount
    startPolling()

    // Handler visibilitychange: berhenti saat tab tidak aktif, resume saat aktif kembali
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startPolling()
      } else {
        stopPolling()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      stopPolling()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [startPolling, stopPolling])

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      setHasUnread(false)
    }
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setHasUnread(false)
    setShowNotifications(false)
  }

  const initial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"

  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center gap-4 border-b border-border bg-surface px-6">
      <button
        className="md:hidden text-text-secondary"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1">
        <div className="relative max-w-md hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
          <input
            type="search"
            placeholder="Cari menu, pesanan, atau pelanggan..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={handleToggleNotifications}
            className="relative p-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-white p-4 shadow-lg ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-bold text-sm text-text-primary">Notifikasi Baru</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Tutup Semua
                  </button>
                )}
              </div>
              <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-text-secondary text-center py-6">Tidak ada notifikasi penting saat ini.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs border ${
                        n.type === "danger"
                          ? "bg-rose-50 border-rose-100 text-rose-800"
                          : n.type === "warning"
                          ? "bg-amber-50 border-amber-100 text-amber-800"
                          : "bg-blue-50 border-blue-100 text-blue-800"
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {n.type === "danger" && <AlertCircle className="h-4 w-4 text-rose-600" />}
                        {n.type === "warning" && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        {n.type === "info" && <ClipboardList className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{n.title}</p>
                        <p className="opacity-95 mt-0.5 leading-normal">{n.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-text-primary">
              {currentUser?.name || "User Kantin"}
            </span>
            <span className="text-xs text-text-secondary capitalize">
              {currentUser?.role?.toLowerCase() || "Guest"}
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {initial}
          </div>
        </div>
      </div>
    </header>
  )
}
