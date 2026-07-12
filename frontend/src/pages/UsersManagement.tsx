import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Shield, User, Plus, Search, Edit, Trash, Loader2, RefreshCw, GraduationCap } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface UserItem {
  id: number
  name: string
  email: string
  role: "ADMIN" | "CASHIER" | "STUDENT"
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export function UsersManagement() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)

  // Form States
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("CASHIER")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get("/users")
      setUsers(response.data)
    } catch (error: any) {
      toast({
        title: "Akses Ditolak / Gagal",
        description: error.response?.data?.message || "Anda tidak memiliki wewenang (ADMIN only) atau server bermasalah.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setName("")
    setEmail("")
    setPassword("")
    setRole("CASHIER")
    setIsAddOpen(true)
  }

  const openEditModal = (user: UserItem) => {
    setSelectedUser(user)
    setName(user.name)
    setEmail(user.email)
    setPassword("") // Empty string means password unchanged
    setRole(user.role)
    setIsEditOpen(true)
  }

  const openDeleteModal = (user: UserItem) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      await api.post("/users", {
        name,
        email,
        password,
        role,
      })
      toast({
        title: "Berhasil",
        description: `Pengguna "${name}" berhasil ditambahkan.`,
      })
      setIsAddOpen(false)
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Gagal Menambahkan Pengguna",
        description: error.response?.data?.message || "Email sudah digunakan atau input salah.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setActionLoading(true)
    try {
      const payload: any = {
        name,
        email,
        role,
      }
      if (password) {
        payload.password = password
      }

      await api.patch(`/users/${selectedUser.id}`, payload)
      toast({
        title: "Berhasil",
        description: `Informasi pengguna "${name}" berhasil diperbarui.`,
      })
      setIsEditOpen(false)
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Gagal Memperbarui Pengguna",
        description: error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    try {
      await api.delete(`/users/${selectedUser.id}`)
      toast({
        title: "Berhasil",
        description: `Akun "${selectedUser.name}" berhasil dihapus.`,
      })
      setIsDeleteOpen(false)
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Gagal Menghapus Akun",
        description: error.response?.data?.message || "Terjadi kesalahan sistem.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Filter users by search query
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculations for Stats Card
  const totalUsers = users.length
  const adminCount = users.filter((u) => u.role === "ADMIN").length
  const cashierCount = users.filter((u) => u.role === "CASHIER").length
  const studentCount = users.filter((u) => u.role === "STUDENT").length

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusIndicator = (lastLoginStr: string | null) => {
    if (!lastLoginStr) {
      return (
        <span className="text-slate-400 flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-slate-300"></span>
          Offline
        </span>
      )
    }

    const lastLogin = new Date(lastLoginStr)
    const now = new Date()
    const diffMs = now.getTime() - lastLogin.getTime()
    const diffMins = diffMs / (1000 * 60)

    // Online Sekarang jika aktif dalam 15 menit terakhir
    if (diffMins <= 15 && diffMins >= 0) {
      return (
        <span className="text-emerald-600 flex items-center gap-1.5 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Online Sekarang
        </span>
      )
    }

    // Berjaga Hari Ini jika login hari ini
    const isToday =
      lastLogin.getDate() === now.getDate() &&
      lastLogin.getMonth() === now.getMonth() &&
      lastLogin.getFullYear() === now.getFullYear()

    if (isToday) {
      return (
        <span className="text-blue-600 flex items-center gap-1.5 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          Berjaga Hari Ini ({lastLogin.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })})
        </span>
      )
    }

    return (
      <span className="text-slate-400 flex items-center gap-1.5 text-xs">
        <span className="h-2 w-2 rounded-full bg-slate-300"></span>
        Offline
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Manajemen Pengguna</h2>
          <p className="text-text-secondary">Kelola hak akses admin dan kasir kantin digital.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openAddModal} className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white">
            <Plus className="h-4 w-4" />
            Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-text-primary">{totalUsers}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Administrator (ADMIN)</CardTitle>
            <Shield className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-indigo-600">{adminCount}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Kasir (CASHIER)</CardTitle>
            <User className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-emerald-600">{cashierCount}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Siswa (STUDENT)</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-blue-600">{studentCount}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User List Card */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-bold text-text-primary">Daftar Pengguna</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
            <Input
              className="pl-9 bg-background border-input focus:ring-primary focus:border-primary"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              Tidak ada pengguna yang ditemukan atau hak akses ditolak.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-border">
                  <TableRow>
                    <TableHead className="font-semibold text-text-primary">ID</TableHead>
                    <TableHead className="font-semibold text-text-primary">Nama Lengkap</TableHead>
                    <TableHead className="font-semibold text-text-primary">Email</TableHead>
                    <TableHead className="font-semibold text-text-primary">Peran (Role)</TableHead>
                    <TableHead className="font-semibold text-text-primary">Status Kehadiran</TableHead>
                    <TableHead className="font-semibold text-text-primary">Tanggal Terdaftar</TableHead>
                    <TableHead className="text-right font-semibold text-text-primary">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className="hover:bg-slate-50/55 transition-colors border-b border-border">
                      <TableCell className="font-medium text-text-secondary">#{u.id}</TableCell>
                      <TableCell className="font-semibold text-text-primary">{u.name}</TableCell>
                      <TableCell className="text-text-primary">{u.email}</TableCell>
                      <TableCell>
                        {u.role === "ADMIN" && (
                          <Badge variant="outline" className="text-indigo-600 border-indigo-600 bg-indigo-50 font-bold gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                        {u.role === "CASHIER" && (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-50 font-semibold gap-1">
                            <User className="h-3 w-3" />
                            Kasir
                          </Badge>
                        )}
                        {u.role === "STUDENT" && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50 font-semibold gap-1">
                            <GraduationCap className="h-3 w-3" />
                            Siswa
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusIndicator(u.lastLogin)}</TableCell>
                      <TableCell className="text-text-secondary text-sm">{formatDate(u.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:bg-primary/10"
                            onClick={() => openEditModal(u)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => openDeleteModal(u)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── ADD USER MODAL ─── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-text-primary">Tambah Pengguna Baru</DialogTitle>
              <DialogDescription>Daftarkan akun administrator atau kasir baru.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Nama Lengkap</label>
                <Input
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Email</label>
                <Input
                  required
                  type="email"
                  placeholder="Contoh: budi@kantin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Password</label>
                <Input
                  required
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Hak Akses (Role)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="STUDENT">SISWA (Aplikasi Android Siswa)</option>
                  <option value="CASHIER">KASIR (Stok &amp; Kasir)</option>
                  <option value="ADMIN">ADMIN (Semua Kontrol &amp; Pengaturan)</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={actionLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={actionLoading} className="bg-primary hover:bg-primary/95 text-white">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tambah Akun
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── EDIT USER MODAL ─── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-text-primary">Edit Informasi Pengguna</DialogTitle>
              <DialogDescription>Perbarui email, nama, password, atau hak akses.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Nama Lengkap</label>
                <Input
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Email</label>
                <Input
                  required
                  type="email"
                  placeholder="Contoh: budi@kantin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Password Baru (Opsional)</label>
                <Input
                  type="password"
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Hak Akses (Role)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="STUDENT">SISWA (Aplikasi Android Siswa)</option>
                  <option value="CASHIER">KASIR (Stok &amp; Kasir)</option>
                  <option value="ADMIN">ADMIN (Semua Kontrol &amp; Pengaturan)</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={actionLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={actionLoading} className="bg-primary hover:bg-primary/95 text-white">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── DELETE USER MODAL ─── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Hapus Akun Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus akun milik <strong>{selectedUser?.name}</strong>? Pengguna ini akan kehilangan semua hak akses ke sistem.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={actionLoading}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-destructive hover:bg-destructive/95 text-white"
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
