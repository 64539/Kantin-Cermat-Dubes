import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Store, Clock, Key, Save, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  createdAt?: string
}

interface CanteenSettings {
  canteenName: string
  schoolName: string
  openHour: string
  closeHour: string
  taxPercent: number
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<"PROFILE" | "CANTEEN">("PROFILE")
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Form States - Profile
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Form States - Canteen Settings
  const [canteenName, setCanteenName] = useState("Kantin Cermat Dubes")
  const [schoolName, setSchoolName] = useState("SMA Negeri Kedutaan Besar")
  const [openHour, setOpenHour] = useState("07:00")
  const [closeHour, setCloseHour] = useState("16:00")
  const [taxPercent, setTaxPercent] = useState("0")

  useEffect(() => {
    // 1. Get user details from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsed = JSON.parse(storedUser) as UserProfile
      setCurrentUser(parsed)
      setName(parsed.name)
      setEmail(parsed.email)
    }

    // 2. Get Canteen operasional settings from localStorage (fallback to defaults)
    const storedCanteen = localStorage.getItem("canteen_settings")
    if (storedCanteen) {
      const parsedCanteen = JSON.parse(storedCanteen) as CanteenSettings
      setCanteenName(parsedCanteen.canteenName || "Kantin Cermat Dubes")
      setSchoolName(parsedCanteen.schoolName || "SMA Negeri Kedutaan Besar")
      setOpenHour(parsedCanteen.openHour || "07:00")
      setCloseHour(parsedCanteen.closeHour || "16:00")
      setTaxPercent((parsedCanteen.taxPercent ?? 0).toString())
    }
  }, [])

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setLoading(true)

    try {
      const payload: any = {
        name,
        email,
      }
      if (password) {
        payload.password = password
      }

      const response = await api.patch(`/users/${currentUser.id}`, payload)
      
      // Update local user state & localStorage
      const updatedUser = {
        ...currentUser,
        name: response.data.name,
        email: response.data.email,
      }
      setCurrentUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      // Reset password field
      setPassword("")

      toast({
        title: "Profil Diperbarui",
        description: "Perubahan profil Anda berhasil disimpan. Muat ulang halaman jika diperlukan.",
      })
      
      // Trigger header refresh dynamically
      window.dispatchEvent(new Event("storage"))
    } catch (error: any) {
      toast({
        title: "Gagal Memperbarui Profil",
        description: error.response?.data?.message || "Pastikan alamat email valid dan belum terdaftar.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Save Canteen Settings Handler
  const handleSaveCanteen = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const settingsPayload: CanteenSettings = {
        canteenName,
        schoolName,
        openHour,
        closeHour,
        taxPercent: parseFloat(taxPercent) || 0,
      }

      localStorage.setItem("canteen_settings", JSON.stringify(settingsPayload))
      
      toast({
        title: "Pengaturan Kantin Disimpan",
        description: "Pengaturan operasional kantin berhasil diperbarui secara lokal.",
      })
    } catch (error: any) {
      toast({
        title: "Gagal Menyimpan Pengaturan",
        description: "Kesalahan internal pada penyimpanan browser.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = currentUser?.role === "ADMIN"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Pengaturan</h2>
        <p className="text-text-secondary">Kelola profil pribadi dan preferensi operasional kantin.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border gap-4">
        <button
          onClick={() => setActiveTab("PROFILE")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "PROFILE"
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Profil Pengguna
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab("CANTEEN")}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "CANTEEN"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Operasional Kantin
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Left Side: Summary Card */}
        <Card className="md:col-span-1 border border-border bg-card shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
              {currentUser?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <CardTitle className="text-xl font-bold text-text-primary mt-4">
              {currentUser?.name || "Memuat..."}
            </CardTitle>
            <CardDescription className="text-sm text-text-secondary">
              {currentUser?.email}
            </CardDescription>
            <div className="pt-2 flex justify-center">
              {currentUser?.role === "ADMIN" ? (
                <Badge variant="outline" className="text-indigo-600 border-indigo-600 bg-indigo-50 font-bold gap-1">
                  <Shield className="h-3 w-3" />
                  Administrator
                </Badge>
              ) : (
                <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-50 font-semibold gap-1">
                  <User className="h-3 w-3" />
                  Kasir
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="border-t border-border pt-4 text-sm text-text-secondary space-y-2">
            <div className="flex justify-between">
              <span>ID Akun:</span>
              <span className="font-semibold text-text-primary">#{currentUser?.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Status Sesi:</span>
              <Badge className="bg-emerald-500 text-white border-none py-0.5">Aktif</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Tab Forms */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === "PROFILE" && (
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profil Pribadi
                </CardTitle>
                <CardDescription>Perbarui nama lengkap, email, atau sandi masuk Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">Nama Lengkap</label>
                    <Input
                      required
                      placeholder="Nama Lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">Alamat Email</label>
                    <Input
                      required
                      type="email"
                      placeholder="email@sekolah.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <label className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-text-secondary" />
                      Ganti Password (Opsional)
                    </label>
                    <Input
                      type="password"
                      placeholder="Masukkan password baru minimal 8 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-text-secondary">
                      *Kosongkan jika Anda tidak berniat mengubah sandi lama.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/95 text-white flex items-center gap-2">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Simpan Profil
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "CANTEEN" && isAdmin && (
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Identitas &amp; Jam Kerja Kantin
                </CardTitle>
                <CardDescription>Sesuaikan detail operasional kantin sekolah (Hanya ADMIN).</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveCanteen} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">Nama Kantin</label>
                    <Input
                      required
                      placeholder="Contoh: Kantin Cermat SMAN 1"
                      value={canteenName}
                      onChange={(e) => setCanteenName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">Nama Sekolah / Lembaga</label>
                    <Input
                      required
                      placeholder="Nama Sekolah"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-text-secondary" />
                        Jam Operasional Buka
                      </label>
                      <Input
                        required
                        type="time"
                        value={openHour}
                        onChange={(e) => setOpenHour(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-text-secondary" />
                        Jam Operasional Tutup
                      </label>
                      <Input
                        required
                        type="time"
                        value={closeHour}
                        onChange={(e) => setCloseHour(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/95 text-white flex items-center gap-2">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Simpan Konfigurasi Operasional
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
