import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash, Loader2, RefreshCw, Folder } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: number
  name: string
  menus: any[]
  createdAt: string
}

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Form States
  const [name, setName] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await api.get("/categories")
      setCategories(response.data)
    } catch (error: any) {
      toast({
        title: "Gagal Mengambil Data",
        description: error.response?.data?.message || "Tidak dapat memuat kategori.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setName("")
    setIsAddOpen(true)
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setName(category.name)
    setIsEditOpen(true)
  }

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      await api.post("/categories", { name })
      toast({
        title: "Berhasil",
        description: `Kategori "${name}" berhasil ditambahkan.`,
      })
      setIsAddOpen(false)
      fetchCategories()
    } catch (error: any) {
      toast({
        title: "Gagal Menambahkan Kategori",
        description: error.response?.data?.message || "Pastikan nama belum pernah digunakan.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return
    setActionLoading(true)
    try {
      await api.patch(`/categories/${selectedCategory.id}`, { name })
      toast({
        title: "Berhasil",
        description: `Kategori berhasil diubah menjadi "${name}".`,
      })
      setIsEditOpen(false)
      fetchCategories()
    } catch (error: any) {
      toast({
        title: "Gagal Memperbarui Kategori",
        description: error.response?.data?.message || "Pastikan nama belum digunakan kategori lain.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return
    setActionLoading(true)
    try {
      await api.delete(`/categories/${selectedCategory.id}`)
      toast({
        title: "Berhasil",
        description: `Kategori "${selectedCategory.name}" berhasil dihapus.`,
      })
      setIsDeleteOpen(false)
      fetchCategories()
    } catch (error: any) {
      toast({
        title: "Gagal Menghapus Kategori",
        description: error.response?.data?.message || "Kategori tidak dapat dihapus karena masih memiliki menu di dalamnya.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Manajemen Kategori</h2>
          <p className="text-text-secondary">Kelola daftar kategori menu makanan dan minuman.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchCategories} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openAddModal} className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white">
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-bold text-text-primary">Daftar Kategori</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
            <Input
              className="pl-9 bg-background border-input focus:ring-primary focus:border-primary"
              placeholder="Cari kategori..."
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
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              Tidak ada kategori yang ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-border">
                  <TableRow>
                    <TableHead className="font-semibold text-text-primary">ID</TableHead>
                    <TableHead className="font-semibold text-text-primary">Nama Kategori</TableHead>
                    <TableHead className="font-semibold text-text-primary">Jumlah Menu</TableHead>
                    <TableHead className="font-semibold text-text-primary">Tanggal Dibuat</TableHead>
                    <TableHead className="text-right font-semibold text-text-primary">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((cat) => (
                    <TableRow key={cat.id} className="hover:bg-slate-50/55 transition-colors border-b border-border">
                      <TableCell className="font-medium text-text-secondary">#{cat.id}</TableCell>
                      <TableCell className="font-semibold text-text-primary">
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-primary" />
                          {cat.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-none font-medium">
                          {cat.menus?.length || 0} menu
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary">{formatDate(cat.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:bg-primary/10"
                            onClick={() => openEditModal(cat)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => openDeleteModal(cat)}
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

      {/* ─── ADD MODAL ─── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-text-primary">Tambah Kategori Baru</DialogTitle>
              <DialogDescription>Masukkan nama kategori menu yang ingin ditambahkan.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Nama Kategori</label>
                <Input
                  required
                  placeholder="Contoh: Makanan Berat, Minuman Dingin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={actionLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={actionLoading} className="bg-primary hover:bg-primary/95 text-white">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tambah Kategori
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── EDIT MODAL ─── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-text-primary">Edit Kategori</DialogTitle>
              <DialogDescription>Ubah nama kategori terpilih.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Nama Kategori</label>
                <Input
                  required
                  placeholder="Contoh: Makanan Berat, Minuman Dingin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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

      {/* ─── DELETE MODAL ─── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Hapus Kategori</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori <strong>{selectedCategory?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
              Hapus Kategori
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
