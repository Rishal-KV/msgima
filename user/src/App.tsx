import { Outlet } from "react-router-dom"
import DashboardLayout from "@/components/dashboard-layout"
import "./index.css"

function App() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export default App
