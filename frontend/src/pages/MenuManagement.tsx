import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash, Loader2, RefreshCw, Upload } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: number
  name: string
}

interface Menu {
  id: number
  name: string
  price: number
  stock: number
  imageUrl: string | null
  status: boolean
  categoryId: number
  category: Category
}

export function MenuManagement() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)

  // Form States
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [stock, setStock] = useState("0")
  const [status, setStatus] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [menuRes, catRes] = await Promise.all([
        api.get("/menu"),
        api.get("/categories"),
      ])
      setMenus(menuRes.data)
      setCategories(catRes.data)
    } catch (error: any) {
      toast({
        title: "Gagal Mengambil Data",
        description: error.response?.data?.message || "Tidak dapat memuat menu atau kategori.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName("")
    setPrice("")
    setCategoryId("")
    setImageUrl("")
    setImagePreview("")
    setStock("0")
    setStatus(true)
  }

  const openAddModal = () => {
    resetForm()
    if (categories.length === 0) {
      toast({
        title: "Perhatian",
        description: "Buat kategori terlebih dahulu sebelum menambahkan menu baru.",
        variant: "destructive",
      })
      return
    }
    setCategoryId(categories[0].id.toString())
    setIsAddOpen(true)
  }

  const openEditModal = (menu: Menu) => {
    setSelectedMenu(menu)
    setName(menu.name)
    setPrice(menu.price.toString())
    setCategoryId(menu.categoryId.toString())
    setImageUrl(menu.imageUrl || "")
    setImagePreview(menu.imageUrl || "")
    setStock(menu.stock.toString())
    setStatus(menu.status)
    setIsEditOpen(true)
  }

  const openDeleteModal = (menu: Menu) => {
    setSelectedMenu(menu)
    setIsDeleteOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show temporary local preview
    const localUrl = URL.createObjectURL(file)
    setImagePreview(localUrl)
    setUploadingImage(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setImageUrl(response.data.imageUrl)
      setImagePreview(response.data.imageUrl) // Sync with final uploaded URL
      toast({
        title: "Gambar Berhasil Diunggah",
        description: "Foto menu berhasil disimpan di server.",
      })
    } catch (error: any) {
      toast({
        title: "Gagal Mengunggah Gambar",
        description: error.response?.data?.message || "Ukuran file terlalu besar (Max 2MB) atau format tidak didukung.",
        variant: "destructive",
      })
      // Reset preview
      setImagePreview("")
      setImageUrl("")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadingImage) {
      toast({
        title: "Mohon Tunggu",
        description: "Gambar sedang diunggah ke server.",
        variant: "warning" as any,
      })
      return
    }
    setActionLoading(true)
    try {
      const payload = {
        name,
        price: parseInt(price),
        category_id: parseInt(categoryId),
        imageUrl: imageUrl || undefined,
        stock: parseInt(stock),
        status,
      }

      await api.post("/menu", payload)
      toast({
        title: "Berhasil",
        description: `Menu "${name}" berhasil ditambahkan.`,
      })
      setIsAddOpen(false)
      fetchData()
    } catch (error: any) {
      toast({
        title: "Gagal Menambahkan Menu",
        description: error.response?.data?.message || "Pastikan semua input sudah sesuai.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMenu) return
    if (uploadingImage) {
      toast({
        title: "Mohon Tunggu",
        description: "Gambar sedang diunggah ke server.",
        variant: "warning" as any,
      })
      return
    }
    setActionLoading(true)
    try {
      const payload = {
        name,
        price: parseInt(price),
        category_id: parseInt(categoryId),
        imageUrl: imageUrl || null,
        status,
      }

      await api.patch(`/menu/${selectedMenu.id}`, payload)
      toast({
        title: "Berhasil",
        description: `Menu "${name}" berhasil diperbarui.`,
      })
      setIsEditOpen(false)
      fetchData()
    } catch (error: any) {
      toast({
        title: "Gagal Memperbarui Menu",
        description: error.response?.data?.message || "Pastikan input sudah sesuai.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedMenu) return
    setActionLoading(true)
    try {
      await api.delete(`/menu/${selectedMenu.id}`)
      toast({
        title: "Berhasil",
        description: `Menu "${selectedMenu.name}" berhasil dihapus.`,
      })
      setIsDeleteOpen(false)
      fetchData()
    } catch (error: any) {
      toast({
        title: "Gagal Menghapus Menu",
        description: error.response?.data?.message || "Menu tidak dapat dihapus karena masih terkait pesanan.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Filter menus based on search query
  const filteredMenus = menus.filter((menu) =>
    menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menu.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Manajemen Menu</h2>
          <p className="text-text-secondary">Kelola daftar menu makanan dan minuman kantin.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openAddModal} className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white">
            <Plus className="h-4 w-4" />
            Tambah Menu
          </Button>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-bold text-text-primary">Daftar Menu</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
            <Input
              className="pl-9 bg-background border-input focus:ring-primary focus:border-primary"
              placeholder="Cari menu atau kategori..."
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
          ) : filteredMenus.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              Tidak ada menu yang ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-border">
                  <TableRow>
                    <TableHead className="font-semibold text-text-primary">Foto</TableHead>
                    <TableHead className="font-semibold text-text-primary">Nama Menu</TableHead>
                    <TableHead className="font-semibold text-text-primary">Kategori</TableHead>
                    <TableHead className="font-semibold text-text-primary">Harga</TableHead>
                    <TableHead className="font-semibold text-text-primary">Stok</TableHead>
                    <TableHead className="font-semibold text-text-primary">Status</TableHead>
                    <TableHead className="text-right font-semibold text-text-primary">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMenus.map((menu) => (
                    <TableRow key={menu.id} className="hover:bg-slate-50/55 transition-colors border-b border-border">
                      <TableCell>
                        <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-border">
                          {menu.imageUrl ? (
                            <img src={menu.imageUrl} alt={menu.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs text-text-secondary font-medium">No Img</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-text-primary">{menu.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-none font-medium">
                          {menu.category?.name || "Tanpa Kategori"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-primary">{formatPrice(menu.price)}</TableCell>
                      <TableCell className="text-text-primary font-medium">{menu.stock} porsi</TableCell>
                      <TableCell>
                        {menu.status ? (
                          <Badge variant="outline" className="text-success border-success bg-emerald-50/50">
                            Tersedia
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-destructive border-destructive bg-rose-50/50">
                            Habis / Nonaktif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:bg-primary/10"
                            onClick={() => openEditModal(menu)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => openDeleteModal(menu)}
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
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-text-primary">Tambah Menu Baru</DialogTitle>
              <DialogDescription>Masukkan detail data menu makanan atau minuman baru.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Nama Menu</label>
                <Input
                  required
                  placeholder="Contoh: Nasi Goreng, Es Teh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Harga (Rp)</label>
                  <Input
                    required
                    type="number"
                    min="0"
                    placeholder="Contoh: 15000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Stok Awal</label>
                  <Input
                    required
                    type="number"
                    min="0"
                    placeholder="Contoh: 20"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Kategori</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* IMAGE UPLOAD ZONE */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Foto Menu</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-border relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-text-secondary font-medium text-center p-1">No Image</span>
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      id="add-image-file"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="add-image-file"
                      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-50 h-10 px-4 py-2 cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      Pilih Gambar
                    </label>
                    <p className="text-xs text-text-secondary mt-1">Format PNG, JPG, WebP sampai 2MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="add-status"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="add-status" className="text-sm font-medium text-text-primary">
                  Menu Langsung Aktif / Tersedia
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={actionLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={actionLoading || uploadingImage} className="bg-primary hover:bg-primary/95 text-white">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Menu
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── EDIT MODAL ─── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-text-primary">Edit Menu</DialogTitle>
              <DialogDescription>Perbarui informasi menu yang dipilih.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Nama Menu</label>
                <Input
                  required
                  placeholder="Contoh: Nasi Goreng, Es Teh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Harga (Rp)</label>
                <Input
                  required
                  type="number"
                  min="0"
                  placeholder="Contoh: 15000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Kategori</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* IMAGE UPLOAD ZONE */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Foto Menu</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-border relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-text-secondary font-medium text-center p-1">No Image</span>
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      id="edit-image-file"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="edit-image-file"
                      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-50 h-10 px-4 py-2 cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      Ubah Gambar
                    </label>
                    <p className="text-xs text-text-secondary mt-1">Format PNG, JPG, WebP sampai 2MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-status"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="edit-status" className="text-sm font-medium text-text-primary">
                  Menu Tersedia / Aktif
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={actionLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={actionLoading || uploadingImage} className="bg-primary hover:bg-primary/95 text-white">
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
            <DialogTitle className="text-xl font-bold text-destructive">Hapus Menu</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus menu <strong>{selectedMenu?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
              Hapus Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
