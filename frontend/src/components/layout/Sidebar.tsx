import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Utensils,
  FolderTree,
  Package,
  ClipboardList,
  Users,
  LineChart,
  Settings,
  LogOut,
  X
} from "lucide-react"

export const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Utensils, label: "Menu", href: "/dashboard/menu" },
  { icon: FolderTree, label: "Kategori", href: "/dashboard/categories" },
  { icon: Package, label: "Stok", href: "/dashboard/stocks" },
  { icon: ClipboardList, label: "Pesanan", href: "/dashboard/orders" },
  { icon: Users, label: "Pengguna", href: "/dashboard/users" },
  { icon: LineChart, label: "Laporan", href: "/dashboard/reports" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/settings" },
]

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (open: boolean) => void }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-surface border-r border-border">
      <div className="flex h-[72px] items-center px-6 border-b border-border justify-between">
        <span className="text-xl font-bold text-primary flex items-center gap-2">
          Kantin Cermat Dubes
        </span>
        <button className="md:hidden text-text-secondary" onClick={() => setMobileOpen(false)}>
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-text-secondary hover:bg-slate-100 hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full hover:bg-red-300 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10" 
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] h-screen sticky top-0 left-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-[280px] transform transition-transform duration-200 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
