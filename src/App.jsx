import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lightTheme, darkTheme } from "./theme/theme";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/dashboard/Analytics";
import CouponManagement from "./pages/dashboard/CouponManagement";
import CreateCoupon from "./pages/dashboard/CreateCoupon";
import Profile from "./pages/dashboard/Profile";

// Layout Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Auth Context
import { AuthProvider } from "./utils/AuthContext";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Provider store={store}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout toggleTheme={toggleTheme} />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="coupons" element={<CouponManagement />} />
              <Route path="coupons/create" element={<CreateCoupon />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
