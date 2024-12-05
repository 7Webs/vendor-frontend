import { useState } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lightTheme, darkTheme } from './theme/theme'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard'
import Analytics from './pages/dashboard/Analytics'
import CouponManagement from './pages/dashboard/CouponManagement'
import CreateCoupon from './pages/dashboard/CreateCoupon'
import Profile from './pages/dashboard/Profile'

// Layout Components
import ProtectedRoute from './components/layout/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Auth Context
import { AuthProvider } from './utils/AuthContext'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute><DashboardLayout toggleTheme={toggleTheme} /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/coupons" element={<CouponManagement />} />
              <Route path="/coupons/create" element={<CreateCoupon />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
