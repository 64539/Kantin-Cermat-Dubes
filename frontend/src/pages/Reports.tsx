import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, Loader2, RefreshCw, BarChart3, TrendingUp, ShoppingBag, DollarSign } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import XLSX from "xlsx-js-style"

interface OrderItem {
  id: number
  quantity: number
  priceAtPurchase: number
  menu: {
    name: string
    category: {
      name: string
    }
  }
}

interface Order {
  id: number
  studentName: string | null
  totalAmount: number
  status: "PENDING" | "PROCESSING" | "READY" | "COMPLETED" | "CANCELLED"
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export function Reports() {
  const [orders, setOrders] = useState<Order[]>([])
  const [dateRange, setDateRange] = useState<"TODAY" | "WEEK" | "MONTH" | "ALL">("ALL")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

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
        title: "Gagal Mengambil Data Laporan",
        description: error.response?.data?.message || "Tidak dapat memuat data laporan.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter orders by selected date range
  const getFilteredOrders = () => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt)

      if (dateRange === "TODAY") {
        return orderDate >= startOfToday
      }
      if (dateRange === "WEEK") {
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return orderDate >= startOfWeek
      }
      if (dateRange === "MONTH") {
        const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return orderDate >= startOfMonth
      }
      return true // ALL
    })
  }

  const filteredOrders = getFilteredOrders()

  // Calculate reporting metrics
  const completedOrders = filteredOrders.filter((o) => o.status === "COMPLETED")
  const canceledOrdersCount = filteredOrders.filter((o) => o.status === "CANCELLED").length
  
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0

  // Calculate total porsi (items) sold
  const totalItemsSold = completedOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, item) => s + item.quantity, 0),
    0
  )

  // Calculate top selling menus
  const getTopSellingMenus = () => {
    const salesMap: Record<string, { quantity: number; revenue: number; category: string }> = {}

    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const menuName = item.menu?.name || "Menu Dihapus"
        const categoryName = item.menu?.category?.name || "Umum"

        if (!salesMap[menuName]) {
          salesMap[menuName] = { quantity: 0, revenue: 0, category: categoryName }
        }
        salesMap[menuName].quantity += item.quantity
        salesMap[menuName].revenue += item.quantity * item.priceAtPurchase
      })
    })

    return Object.entries(salesMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5) // Show top 5
  }

  const topSellingMenus = getTopSellingMenus()

  // Calculate sales by category
  const getSalesByCategory = () => {
    const categoryMap: Record<string, { quantity: number; revenue: number }> = {}

    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const categoryName = item.menu?.category?.name || "Lain-lain"
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = { quantity: 0, revenue: 0 }
        }
        categoryMap[categoryName].quantity += item.quantity
        categoryMap[categoryName].revenue += item.quantity * item.priceAtPurchase
      })
    })

    return Object.entries(categoryMap).map(([name, data]) => ({ name, ...data }))
  }

  const salesByCategory = getSalesByCategory()

  // Format IDR helper
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

  // EXPORT EXCEL FUNCTION
  const exportToExcel = () => {
    if (orders.length === 0) {
      toast({
        title: "Ekspor Gagal",
        description: "Tidak ada data transaksi untuk diekspor.",
        variant: "destructive",
      })
      return
    }

    try {
      // 1. sheet 1: Ringkasan Laporan
      const summaryData = [
        ["LAPORAN KEUANGAN KANTIN CERMAT DUBES"],
        ["Tanggal Unduh", new Date().toLocaleString("id-ID")],
        ["Periode Filter", dateRange === "TODAY" ? "Hari Ini" : dateRange === "WEEK" ? "7 Hari Terakhir" : dateRange === "MONTH" ? "30 Hari Terakhir" : "Semua Waktu"],
        [],
        ["Metrik Ringkasan Keuangan", "Nilai / Jumlah"],
        ["Total Pendapatan Bersih", formatPrice(totalRevenue)],
        ["Transaksi Selesai (Completed)", `${completedOrders.length} transaksi`],
        ["Transaksi Batal (Cancelled)", `${canceledOrdersCount} transaksi`],
        ["Total Porsi Terjual", `${totalItemsSold} porsi`],
        ["Rata-rata Pembelian per Transaksi", formatPrice(averageOrderValue)],
      ]

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
      
      // Set Column Widths for Summary Sheet
      wsSummary["!cols"] = [
        { wch: 35 }, // Metrik Ringkasan Keuangan
        { wch: 25 }, // Nilai / Jumlah
      ]

      // Merge Title A1:B1
      wsSummary["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }
      ]

      // Style wsSummary
      for (const cellRef in wsSummary) {
        if (cellRef[0] === "!") continue
        const cell = wsSummary[cellRef]
        
        // Default style
        cell.s = {
          font: { name: "Calibri", sz: 11 },
          alignment: { vertical: "center" }
        }

        // Title styling
        if (cellRef === "A1") {
          cell.s = {
            font: { name: "Calibri", sz: 16, bold: true, color: { rgb: "1E3A8A" } },
            alignment: { horizontal: "left", vertical: "center" }
          }
        }

        // Metadata styling
        if (["A2", "B2", "A3", "B3"].includes(cellRef)) {
          cell.s.font.color = { rgb: "475569" }
          cell.s.font.sz = 9
        }

        // Header Row (Row 5 - Metrik & Nilai)
        if (cellRef === "A5" || cellRef === "B5") {
          cell.s = {
            font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "2563EB" } }, // Dashboard Primary Blue
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "CBD5E1" } },
              bottom: { style: "medium", color: { rgb: "1E3A8A" } },
              left: { style: "thin", color: { rgb: "CBD5E1" } },
              right: { style: "thin", color: { rgb: "CBD5E1" } }
            }
          }
        }

        // Data Rows (6 to 10)
        const rowNum = parseInt(cellRef.replace(/^[A-Z]+/, ""))
        if (rowNum >= 6 && rowNum <= 10) {
          const colLetter = cellRef.match(/^[A-Z]+/)?.[0]
          
          cell.s.border = {
            bottom: { style: "thin", color: { rgb: "E2E8F0" } },
            left: { style: "thin", color: { rgb: "E2E8F0" } },
            right: { style: "thin", color: { rgb: "E2E8F0" } }
          }

          // Alternate background
          if (rowNum % 2 === 1) {
            cell.s.fill = { fgColor: { rgb: "F8FAFC" } }
          }

          if (colLetter === "A") {
            cell.s.font.bold = false
            cell.s.alignment.horizontal = "left"
          } else {
            cell.s.font.bold = true
            cell.s.alignment.horizontal = "right"
          }
        }
      }

      // 2. sheet 2: Detail Transaksi
      const transactionHeader = ["ID Transaksi", "Waktu Transaksi", "Nama Pembeli", "Menu Dipesan", "Total Bayar", "Status"]
      const transactionRows = filteredOrders.map((o) => [
        `#${o.id}`,
        formatDate(o.createdAt),
        o.studentName || "Pelanggan Umum",
        o.items.map((it) => `${it.quantity}x ${it.menu?.name || "Menu"}`).join(", "),
        formatPrice(o.totalAmount),
        o.status,
      ])

      const wsTransactions = XLSX.utils.aoa_to_sheet([transactionHeader, ...transactionRows])

      // Set Column Widths for Transactions Sheet
      wsTransactions["!cols"] = [
        { wch: 15 }, // ID Transaksi
        { wch: 25 }, // Waktu Transaksi
        { wch: 22 }, // Nama Pembeli
        { wch: 48 }, // Menu Dipesan
        { wch: 20 }, // Total Bayar
        { wch: 15 }, // Status
      ]

      // Style wsTransactions
      for (const cellRef in wsTransactions) {
        if (cellRef[0] === "!") continue
        const cell = wsTransactions[cellRef]
        const rowNum = parseInt(cellRef.replace(/^[A-Z]+/, ""))
        const colLetter = cellRef.match(/^[A-Z]+/)?.[0]

        cell.s = {
          font: { name: "Calibri", sz: 10 },
          alignment: { vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "E2E8F0" } },
            bottom: { style: "thin", color: { rgb: "E2E8F0" } },
            left: { style: "thin", color: { rgb: "E2E8F0" } },
            right: { style: "thin", color: { rgb: "E2E8F0" } }
          }
        }

        // Header Row (Row 1)
        if (rowNum === 1) {
          cell.s = {
            font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "2563EB" } }, // Dashboard Primary Blue
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "CBD5E1" } },
              bottom: { style: "medium", color: { rgb: "1E3A8A" } },
              left: { style: "thin", color: { rgb: "CBD5E1" } },
              right: { style: "thin", color: { rgb: "CBD5E1" } }
            }
          }
        } else {
          // Zebra striping
          if (rowNum % 2 === 1) {
            cell.s.fill = { fgColor: { rgb: "F8FAFC" } }
          }
          
          // Alignments
          if (colLetter === "A" || colLetter === "F") {
            cell.s.alignment.horizontal = "center"
          } else if (colLetter === "B") {
            cell.s.alignment.horizontal = "center"
            cell.s.font.sz = 9
          } else if (colLetter === "E") {
            cell.s.alignment.horizontal = "right"
            cell.s.font.bold = true
            cell.s.font.color = { rgb: "2563EB" } // Blue color for pricing
          } else {
            cell.s.alignment.horizontal = "left"
          }
          
          // Status coloring based on value
          if (colLetter === "F") {
            if (cell.v === "COMPLETED") {
              cell.s.font.color = { rgb: "16A34A" } // Emerald green
              cell.s.font.bold = true
            } else if (cell.v === "CANCELLED") {
              cell.s.font.color = { rgb: "DC2626" } // Crimson red
              cell.s.font.bold = true
            } else {
              cell.s.font.color = { rgb: "D97706" } // Amber orange
              cell.s.font.bold = true
            }
          }
        }
      }

      // 3. Create Workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan Laporan")
      XLSX.utils.book_append_sheet(wb, wsTransactions, "Daftar Transaksi")

      // 4. Save file
      const timestamp = new Date().toISOString().slice(0, 10)
      XLSX.writeFile(wb, `Laporan_Keuangan_Kantin_Dubes_${timestamp}.xlsx`)

      toast({
        title: "Ekspor Berhasil",
        description: "Laporan keuangan berhasil diunduh sebagai file Excel (.xlsx).",
      })
    } catch (error: any) {
      toast({
        title: "Ekspor Gagal",
        description: error.message || "Terjadi kesalahan saat memproses ekspor Excel.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Laporan Keuangan</h2>
          <p className="text-text-secondary">Analisis pendapatan kantin dan ekspor laporan ke format Excel.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Date filter dropdown */}
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
          >
            <option value="ALL">Semua Waktu</option>
            <option value="TODAY">Hari Ini</option>
            <option value="WEEK">7 Hari Terakhir</option>
            <option value="MONTH">30 Hari Terakhir</option>
          </select>
          <Button variant="outline" size="icon" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={exportToExcel}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Ekspor Excel
          </Button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Pendapatan Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-primary">{formatPrice(totalRevenue)}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Transaksi Selesai</CardTitle>
            <ShoppingBag className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-success">{completedOrders.length}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Porsi Terjual</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-indigo-600">{totalItemsSold} porsi</div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text-secondary">Rata-rata Transaksi</CardTitle>
            <BarChart3 className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold text-warning">{formatPrice(averageOrderValue)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Selling Menus */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-text-primary">Top 5 Menu Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : topSellingMenus.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">Belum ada menu yang terjual.</div>
            ) : (
              <div className="space-y-4">
                {topSellingMenus.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-text-primary">{index + 1}. {item.name}</span>
                        <span className="text-xs text-text-secondary ml-2">({item.category})</span>
                      </div>
                      <span className="font-semibold text-text-primary">{item.quantity} terjual ({formatPrice(item.revenue)})</span>
                    </div>
                    {/* Visual progress bar representation */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(item.quantity / topSellingMenus[0].quantity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-text-primary">Kontribusi per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : salesByCategory.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">Belum ada kategori yang terjual.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-text-primary">Kategori</TableHead>
                      <TableHead className="font-semibold text-text-primary">Total Terjual</TableHead>
                      <TableHead className="text-right font-semibold text-text-primary">Total Pendapatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesByCategory.map((cat, idx) => (
                      <TableRow key={idx} className="border-b border-border">
                        <TableCell className="font-semibold text-text-primary">{cat.name}</TableCell>
                        <TableCell>{cat.quantity} porsi</TableCell>
                        <TableCell className="text-right font-bold text-primary">{formatPrice(cat.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
