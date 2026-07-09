import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, AlertTriangle, XCircle, Search, Edit2, Trash2, Loader2, RefreshCw } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface StockItem {
  id: number
  name: string
  stock: number
  status: boolean
  price: number
  category: { id: number; name: string }
  updatedAt: string
}

export function StockManagement() {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // Modal States
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)

  // Form States
  const [stockInput, setStockInput] = useState("")

  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    setLoading(true)
    try {
      const response = await api.get("/stocks")
      setStocks(response.data)
    } catch (error: any) {
      toast({
        title: "Gagal Mengambil Data Stok",
        description: error.response?.data?.message || "Tidak dapat memuat daftar stok.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openUpdateModal = (item: StockItem) => {
    setSelectedItem(item)
    setStockInput(item.stock.toString())
    setIsUpdateOpen(true)
  }

  const openResetModal = (item: StockItem) => {
    setSelectedItem(item)
    setIsResetOpen(true)
  }

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return
    setActionLoading(true)
    try {
      await api.patch(`/stocks/${selectedItem.id}`, {
        stock: parseInt(stockInput),
      })
      toast({
        title: "Stok Diperbarui",
        description: `Stok untuk "${selectedItem.name}" berhasil diubah menjadi ${stockInput}.`,
      })
      setIsUpdateOpen(false)
      fetchStocks()
    } catch (error: any) {
      toast({
        title: "Gagal Memperbarui Stok",
        description: error.response?.data?.message || "Pastikan jumlah stok bernilai positif.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleResetStock = async () => {
    if (!selectedItem) return
    setActionLoading(true)
    try {
      await api.delete(`/stocks/${selectedItem.id}`)
      toast({
        title: "Stok Direset",
        description: `Stok untuk "${selectedItem.name}" telah direset ke 0 dan menu dinonaktifkan.`,
      })
      setIsResetOpen(false)
      fetchStocks()
    } catch (error: any) {
      toast({
        title: "Gagal Mereset Stok",
        description: error.response?.data?.message || "Terjadi kesalahan sistem.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Filter stocks by search
  const filteredStocks = stocks.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculations for Stats Card
  const totalProducts = stocks.length
  const lowStockCount = stocks.filter((item) => item.stock > 0 && item.stock <= 5).length
  const outOfStockCount = stocks.filter((item) => item.stock === 0).length

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Manajemen Stok</h2>
          <p className="text-text-secondary">Pantau ketersediaan porsi dan kelola stok menu kantin.</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchStocks} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Total Menu Terdaftar</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-text-primary">{totalProducts}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Stok Menipis (≤ 5)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-warning">{lowStockCount}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Stok Habis</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-destructive">{outOfStockCount}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stock List Card */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-bold text-text-primary">Daftar Stok Menu</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
            <Input
              className="pl-9 bg-background border-input focus:ring-primary focus:border-primary"
              placeholder="Cari menu..."
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
          ) : filteredStocks.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              Tidak ada menu yang ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-border">
                  <TableRow>
                    <TableHead className="font-semibold text-text-primary">Nama Menu</TableHead>
                    <TableHead className="font-semibold text-text-primary">Kategori</TableHead>
                    <TableHead className="font-semibold text-text-primary">Stok Saat Ini</TableHead>
                    <TableHead className="font-semibold text-text-primary">Status Penjualan</TableHead>
                    <TableHead className="font-semibold text-text-primary">Update Terakhir</TableHead>
                    <TableHead className="text-right font-semibold text-text-primary">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/55 transition-colors border-b border-border">
                      <TableCell className="font-semibold text-text-primary">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-none font-medium">
                          {item.category?.name || "Tanpa Kategori"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${item.stock === 0 ? "text-destructive" : item.stock <= 5 ? "text-warning" : "text-text-primary"}`}>
                          {item.stock} porsi
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.status ? (
                          <Badge variant="outline" className="text-success border-success bg-emerald-50/50">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-destructive border-destructive bg-rose-50/50">
                            Nonaktif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-text-secondary text-xs">{formatDate(item.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:bg-primary/10 gap-1"
                            onClick={() => openUpdateModal(item)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Update
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 gap-1"
                            onClick={() => openResetModal(item)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Reset
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

      {/* ─── UPDATE STOCK MODAL ─── */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <form onSubmit={handleUpdateStock}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-text-primary">Update Stok Menu</DialogTitle>
              <DialogDescription>
                Ubah jumlah ketersediaan porsi untuk menu <strong>{selectedItem?.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Jumlah Stok (Porsi)</label>
                <Input
                  required
                  type="number"
                  min="0"
                  placeholder="Contoh: 35"
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value)}
                />
                <p className="text-xs text-text-secondary">
                  *Menu akan otomatis aktif jika stok &gt; 0, dan nonaktif jika stok diubah ke 0.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUpdateOpen(false)} disabled={actionLoading}>
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

      {/* ─── RESET STOCK MODAL ─── */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Reset Stok Menu</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mereset stok untuk menu <strong>{selectedItem?.name}</strong> ke 0? Ini juga akan menonaktifkan menu dari halaman pemesanan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsResetOpen(false)} disabled={actionLoading}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetStock}
              disabled={actionLoading}
              className="bg-destructive hover:bg-destructive/95 text-white"
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Stok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
