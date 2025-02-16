import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  styled,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Container,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import { useAuth } from "../../utils/contexts/AuthContext";

const StyledSection = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%)",
  padding: "30px 0",
}));

const AuthCard = styled(Box)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: "24px",
  padding: "40px",
  maxWidth: "480px",
  margin: "0 auto",
  boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#f8faff",
    "& fieldset": {
      borderColor: "#e1e8ff",
    },
    "&:hover fieldset": {
      borderColor: "#1E3FE4",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1E3FE4",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#1E3FE4",
    },
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1E3FE4",
  color: "white",
  padding: "12px",
  borderRadius: "12px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "#1733b7",
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  padding: "12px",
  borderRadius: "12px",
  backgroundColor: "#f8faff",
  color: "#333",
  border: "1px solid #e1e8ff",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#f0f4ff",
    borderColor: "#1E3FE4",
  },
}));

const TabButton = styled(Typography)(({ isactive }) => ({
  fontSize: "24px",
  fontWeight: 600,
  color: isactive === "true" ? "#1E3FE4" : "#999",
  cursor: "pointer",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: 0,
    width: isactive === "true" ? "100%" : 0,
    height: "3px",
    backgroundColor: "#1E3FE4",
    borderRadius: "2px",
    transition: "width 0.3s ease",
  },
}));

const Login = () => {
  const [activeTab, setActiveTab] = useState("tabButton1");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const {
    user,
    loading,
    authChecked,
    login,
    register,
    loginWithGoogle,
    loginWithApple,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && user) {
      navigate("/coupons");
    }
  }, [user, authChecked, navigate]);

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "", // Ensure value is never null
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await register(formData.email, formData.password);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StyledSection>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img
            src="https://nanoinfluencers.io/wp-content/uploads/2024/11/nanoinfluencers.io_Logo_small-removebg-preview.png"
            alt="Logo"
            style={{ height: "60px", marginBottom: "24px" }}
          />
        </Box>

        <AuthCard>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 4, mb: 4 }}
          >
            <TabButton
              isactive={(activeTab === "tabButton1").toString()}
              onClick={() => handleTab("tabButton1")}
              variant="h5"
            >
              Login
            </TabButton>
            <TabButton
              isactive={(activeTab === "tabButton2").toString()}
              onClick={() => handleTab("tabButton2")}
              variant="h5"
            >
              Register
            </TabButton>
          </Box>

          {activeTab === "tabButton1" && (
            <Box component="form" onSubmit={handleLogin}>
              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <StyledTextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ mb: 2 }}>
                <Link
                  to="/forgot-password"
                  style={{ color: "#1E3FE4", textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </Box>
              <PrimaryButton fullWidth type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? <CircularProgress size={24} /> : "Login"}
              </PrimaryButton>

              <Divider sx={{ my: 3 }}>or continue with</Divider>

              <Box sx={{ display: "flex", gap: 2 }}>
                <SocialButton
                  fullWidth
                  onClick={loginWithGoogle}
                  startIcon={<GoogleIcon />}
                >
                  Google
                </SocialButton>
                <SocialButton
                  fullWidth
                  onClick={loginWithApple}
                  startIcon={<AppleIcon />}
                >
                  Apple
                </SocialButton>
              </Box>
            </Box>
          )}

          {activeTab === "tabButton2" && (
            <Box component="form" onSubmit={handleRegister}>
              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <StyledTextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <PrimaryButton fullWidth type="submit" disabled={isRegistering}>
                {isRegistering ? <CircularProgress size={24} /> : "Register"}
              </PrimaryButton>
              <Divider sx={{ my: 3 }}>or continue with</Divider>
              <Box sx={{ display: "flex", gap: 2 }}>
                <SocialButton
                  fullWidth
                  onClick={loginWithGoogle}
                  startIcon={<GoogleIcon />}
                >
                  Google
                </SocialButton>
                <SocialButton
                  fullWidth
                  onClick={loginWithApple}
                  startIcon={<AppleIcon />}
                >
                  Apple
                </SocialButton>
              </Box>
            </Box>
          )}
        </AuthCard>
      </Container>
    </StyledSection>
  );
};

export default Login;
