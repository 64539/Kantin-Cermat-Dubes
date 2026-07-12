import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ClipboardList, CheckCircle, DollarSign, Search, Loader2, Eye, RefreshCw, ChevronRight } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: number
  quantity: number
  priceAtPurchase: number
  menu: {
    id: number
    name: string
    category: {
      name: string
    }
  }
}

interface Order {
  id: number
  orderNumber: string
  studentName: string | null
  totalAmount: number
  status: "PENDING" | "PROCESSING" | "READY" | "COMPLETED" | "CANCELLED"
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // Modal States
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Status Form State
  const [statusInput, setStatusInput] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await api.get("/orders")
      setOrders(response.data)
    } catch (error: any) {
      toast({
        title: "Gagal Mengambil Data Transaksi",
        description: error.response?.data?.message || "Tidak dapat memuat riwayat transaksi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order)
    setStatusInput(order.status)
    setIsStatusOpen(true)
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return
    setActionLoading(true)
    try {
      await api.patch(`/orders/${selectedOrder.id}`, {
        status: statusInput,
      })
      toast({
        title: "Status Diperbarui",
        description: `Status transaksi #${selectedOrder.id} diubah menjadi ${statusInput}.`,
      })
      setIsStatusOpen(false)
      fetchOrders()
    } catch (error: any) {
      toast({
        title: "Gagal Memperbarui Status",
        description: error.response?.data?.message || "Terjadi kesalahan saat memperbarui status.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Formatting helpers
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Status Badge styling helper
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="text-amber-600 border-amber-600 bg-amber-50">Pending</Badge>
      case "PROCESSING":
        return <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">Diproses</Badge>
      case "READY":
        return <Badge variant="outline" className="text-indigo-600 border-indigo-600 bg-indigo-50">Siap Saji</Badge>
      case "COMPLETED":
        return <Badge variant="outline" className="text-success border-success bg-emerald-50">Selesai</Badge>
      case "CANCELLED":
        return <Badge variant="outline" className="text-destructive border-destructive bg-rose-50">Batal</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Filter orders based on status select and search input (studentName)
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter
    const nameMatch = (order.studentName || "").toLowerCase().includes(searchQuery.toLowerCase())
    const idMatch = order.id.toString() === searchQuery
    return matchesStatus && (nameMatch || idMatch)
  })

  // Statistics calculation
  const totalOrders = orders.length
  const completedOrdersCount = orders.filter((o) => o.status === "COMPLETED").length
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Monitor Transaksi</h2>
          <p className="text-text-secondary">Pantau, filter, dan periksa status semua transaksi riwayat pesanan.</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Transaction stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Total Transaksi</CardTitle>
            <ClipboardList className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-text-primary">{totalOrders}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Transaksi Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-success">{completedOrdersCount}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Total Pendapatan Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-3xl font-bold text-primary">{formatPrice(totalRevenue)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction List Card */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <CardTitle className="text-lg font-bold text-text-primary">Riwayat Transaksi</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Diproses</option>
              <option value="READY">Siap Saji</option>
              <option value="COMPLETED">Selesai</option>
              <option value="CANCELLED">Dibatalkan</option>
            </select>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
              <Input
                className="pl-9 bg-background border-input focus:ring-primary focus:border-primary w-full sm:w-64"
                placeholder="Cari nama atau ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              Tidak ada transaksi yang ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-border">
                  <TableRow>
                    <TableHead className="font-semibold text-text-primary">No. Invoice</TableHead>
                    <TableHead className="font-semibold text-text-primary">Nama Pembeli</TableHead>
                    <TableHead className="font-semibold text-text-primary">Detail Menu Dipesan</TableHead>
                    <TableHead className="font-semibold text-text-primary">Total Pembayaran</TableHead>
                    <TableHead className="font-semibold text-text-primary">Tanggal &amp; Waktu</TableHead>
                    <TableHead className="font-semibold text-text-primary">Status</TableHead>
                    <TableHead className="text-right font-semibold text-text-primary">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50/55 transition-colors border-b border-border">
                      <TableCell className="font-mono text-xs font-bold text-text-secondary">{order.orderNumber}</TableCell>
                      <TableCell className="font-semibold text-text-primary">
                        {order.studentName || "Pelanggan Umum"}
                      </TableCell>
                      <TableCell className="text-text-primary text-sm max-w-xs truncate">
                        {order.items.map((it) => `${it.quantity}x ${it.menu?.name}`).join(", ")}
                      </TableCell>
                      <TableCell className="text-text-primary font-medium">{formatPrice(order.totalAmount)}</TableCell>
                      <TableCell className="text-text-secondary text-xs">{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:bg-primary/10 gap-1"
                            onClick={() => openDetailModal(order)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                          </Button>
                          {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-indigo-600 hover:bg-indigo-50 gap-1"
                              onClick={() => openStatusModal(order)}
                            >
                              Status
                            </Button>
                          )}
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

      {/* ─── TRANSACTION DETAIL MODAL ─── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text-primary flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Detail Transaksi {selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription>
              Diperbarui pada: {selectedOrder && formatDate(selectedOrder.updatedAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 border-t border-b border-border my-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-text-secondary font-medium">Pembeli:</span>
              <span className="text-text-primary font-bold text-right">
                {selectedOrder?.studentName || "Pelanggan Umum"}
              </span>
              <span className="text-text-secondary font-medium">Status Transaksi:</span>
              <div className="text-right">
                {selectedOrder && getStatusBadge(selectedOrder.status)}
              </div>
              <span className="text-text-secondary font-medium">Tanggal Pemesanan:</span>
              <span className="text-text-primary text-right text-xs">
                {selectedOrder && formatDate(selectedOrder.createdAt)}
              </span>
            </div>

            {/* Items list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Item Dipesan</h4>
              <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-border">
                {selectedOrder?.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-100 last:border-b-0 pb-1.5 last:pb-0">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-primary">{item.menu?.name}</span>
                      <span className="text-xs text-text-secondary">{item.menu?.category?.name}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-xs text-text-secondary">{item.quantity} porsi x {formatPrice(item.priceAtPurchase)}</span>
                      <span className="font-bold text-text-primary">{formatPrice(item.quantity * item.priceAtPurchase)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-text-primary text-base">Total Bayar:</span>
              <span className="font-extrabold text-primary text-lg">{selectedOrder && formatPrice(selectedOrder.totalAmount)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setIsDetailOpen(false)} className="w-full bg-primary hover:bg-primary/95 text-white">
              Tutup Detail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── STATUS UPDATE MODAL ─── */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <form onSubmit={handleUpdateStatus}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-text-primary">Update Status Transaksi</DialogTitle>
              <DialogDescription>
                Ubah alur pemrosesan pesanan #{selectedOrder?.id}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Pilih Status Baru</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                >
                  <option value="PENDING">Pending (Menunggu)</option>
                  <option value="PROCESSING">Processing (Diproses)</option>
                  <option value="READY">Ready (Siap Saji)</option>
                  <option value="COMPLETED">Completed (Selesai)</option>
                  <option value="CANCELLED">Cancelled (Batalkan)</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsStatusOpen(false)} disabled={actionLoading}>
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
    </div>
  )
}
