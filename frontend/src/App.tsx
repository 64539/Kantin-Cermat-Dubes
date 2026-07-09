import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { MenuManagement } from "./pages/MenuManagement"
import { CategoriesManagement } from "./pages/CategoriesManagement"
import { StockManagement } from "./pages/StockManagement"
import { Orders } from "./pages/Orders"
import { UsersManagement } from "./pages/UsersManagement"
import { Reports } from "./pages/Reports"
import { Settings } from "./pages/Settings"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="stocks" element={<StockManagement />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all: redirect ke login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
