import { Toaster } from "sonner"
import { Outlet } from "react-router-dom"
import DashboardLayout from "@/components/dashboard-layout"
import "./index.css"

function App() {
  return (
    <DashboardLayout>
      <Outlet />
      <Toaster position="top-right" richColors />
    </DashboardLayout>
  )
}

export default App
