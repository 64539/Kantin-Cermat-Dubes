import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, ShoppingBag, CreditCard, AlertCircle, Loader2, RefreshCw, TrendingUp } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: number
  studentName: string | null
  totalAmount: number
  status: "PENDING" | "PROCESSING" | "READY" | "COMPLETED" | "CANCELLED"
  createdAt: string
  items?: {
    quantity: number
    menu?: {
      name: string
    } | null
  }[]
}

interface StockItem {
  id: number
  name: string
  stock: number
  price: number
}

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [ordersRes, stocksRes] = await Promise.all([
        api.get("/orders"),
        api.get("/stocks"),
      ])
      
      // Pastikan data yang diset adalah array
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : [])
      setStocks(Array.isArray(stocksRes.data) ? stocksRes.data : [])
    } catch (error: any) {
      toast({
        title: "Gagal Memuat Dashboard",
        description: error.response?.data?.message || "Tidak dapat mengambil data ringkasan.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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

  // Calculations
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  const safeOrders = Array.isArray(orders) ? orders : []
  const safeStocks = Array.isArray(stocks) ? stocks : []

  // 1. Total Penjualan Hari Ini (Completed orders created today)
  const todayRevenue = safeOrders
    .filter((o) => o?.status === "COMPLETED" && o?.createdAt && new Date(o.createdAt).getTime() >= startOfToday)
    .reduce((sum, o) => sum + (o?.totalAmount || 0), 0)

  // 2. Total Transaksi Hari Ini
  const todayTransactionsCount = safeOrders.filter(
    (o) => o?.createdAt && new Date(o.createdAt).getTime() >= startOfToday
  ).length

  // 3. Total Pesanan Aktif (PENDING, PROCESSING, READY)
  const activeOrdersCount = safeOrders.filter(
    (o) => o?.status === "PENDING" || o?.status === "PROCESSING" || o?.status === "READY"
  ).length

  // 4. Stok Menipis (<= 5)
  const lowStockCount = safeStocks.filter((s) => (s?.stock ?? 0) <= 5).length

  // 5. Recent Orders (last 5)
  const recentOrders = safeOrders.slice(0, 5)

  // 6. Get Top Selling items for summary panel
  const getPopularItems = () => {
    const counts: Record<string, number> = {}
    safeOrders
      .filter((o) => o?.status === "COMPLETED")
      .forEach((o) => {
        if (Array.isArray(o?.items)) {
          o.items.forEach((item) => {
            const name = item?.menu?.name || "Menu"
            counts[name] = (counts[name] || 0) + (item?.quantity || 0)
          })
        }
      })
    return Object.entries(counts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 4)
  }

  const popularItems = getPopularItems()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h2>
          <p className="text-text-secondary">Ringkasan aktivitas operasional dan transaksi kantin hari ini.</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchDashboardData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Top metrics grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Penjualan Hari Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-primary">{formatPrice(todayRevenue)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Transaksi Hari Ini</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-text-primary">{todayTransactionsCount} order</div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Pesanan Aktif</CardTitle>
            <ShoppingBag className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-indigo-600">{activeOrdersCount} antrean</div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Peringatan Stok (≤ 5)</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-warning">{lowStockCount} produk</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Popular items and stats summary */}
        <Card className="lg:col-span-4 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Menu Paling Laris
            </CardTitle>
            <CardDescription>Produk dengan kuantitas penjualan tertinggi di kantin.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : popularItems.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">Belum ada transaksi penjualan selesai.</div>
            ) : (
              <div className="space-y-4 pt-2">
                {popularItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-text-primary">{item.name}</span>
                    </div>
                    <Badge className="bg-primary/15 text-primary border-none font-bold">
                      {item.qty} Porsi Terjual
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Orders */}
        <Card className="lg:col-span-3 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
              <ClipboardListIcon />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">Belum ada pesanan masuk.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-text-primary">Siswa / Pembeli</TableHead>
                    <TableHead className="font-semibold text-text-primary">Status</TableHead>
                    <TableHead className="text-right font-semibold text-text-primary">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} className="border-b border-border">
                      <TableCell className="font-medium text-text-primary">
                        {order.studentName || "Umum"}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right font-bold text-text-primary">
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ClipboardListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  )
}
