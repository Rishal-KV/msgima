import { Toaster } from "sonner"
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "@/components/dashboard-layout"
import UserPage from './pages/users/UserPage.tsx';
import { ThemeProvider } from "@/components/theme-provider"
import "./index.css"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<UserPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  )
}

function RootLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export default App
