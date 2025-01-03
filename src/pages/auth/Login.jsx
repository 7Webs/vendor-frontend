import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Link,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Apple as AppleIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Logo from "../../assets/logo-main.png";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const {
    user,
    loading,
    loginWithGoogle,
    loginWithApple,
    login,
    register,
    resetPassword,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithApple();
      navigate("/dashboard");
    } catch (error) {
      console.error("Apple login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (isRegisterMode && password !== confirmPassword) {
      console.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      if (isRegisterMode) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(
        isRegisterMode ? "Registration error:" : "Login error:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter an email address to reset your password.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email);
      console.log("Reset password email sent");
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRegisterMode = () => {
    setIsRegisterMode((prev) => !prev);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  return (
    <Container
      component="main"
      maxWidth="xxl"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        py: "40px",
        background: "linear-gradient(135deg, #84fab0, #8fd3f4)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 2,
          borderRadius: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "20%" }} />
        <Typography
          component="h1"
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 2 }}
        >
          {isRegisterMode ? "Create an Account" : "Welcome Back!"}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          {isRegisterMode
            ? "Register a new account"
            : "Sign in to your account"}
        </Typography>
        <Box>
          {/* {isRegisterMode && (
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
          )} */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {isRegisterMode && (
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          <Button
            onClick={handleEmailLogin}
            fullWidth
            variant="contained"
            sx={{
              mb: 2,
              backgroundColor: isRegisterMode ? "#28a745" : "#007BFF",
              color: "white",
              "&:hover": {
                backgroundColor: isRegisterMode ? "#218838" : "#0056b3",
              },
              fontWeight: "bold",
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isRegisterMode ? (
              "Create Account"
            ) : (
              "Login with Email"
            )}
          </Button>
          {!isRegisterMode && (
            <>
              <Button
                onClick={handleResetPassword}
                fullWidth
                variant="text"
                sx={{ mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Forgot Password?"
                )}
              </Button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <hr style={{ flexGrow: 1 }} />
                &nbsp; OR &nbsp;
                <hr style={{ flexGrow: 1 }} />
              </div>
              <Button
                onClick={handleGoogleLogin}
                fullWidth
                variant="contained"
                startIcon={<GoogleIcon />}
                sx={{
                  mt: 2,
                  mb: 2,
                  backgroundColor: "#DB4437",
                  color: "white",
                  "&:hover": { backgroundColor: "#c33d2e" },
                  fontWeight: "bold",
                }}
                disabled={isLoading}
              >
                Continue with Google
              </Button>
              <Button
                onClick={handleAppleLogin}
                fullWidth
                variant="contained"
                startIcon={<AppleIcon />}
                sx={{
                  mb: 2,
                  backgroundColor: "#000000",
                  color: "white",
                  "&:hover": { backgroundColor: "#333333" },
                  fontWeight: "bold",
                }}
                disabled={isLoading}
              >
                Continue with Apple
              </Button>
            </>
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mt: 3, fontSize: "0.85rem" }}
        >
          {isRegisterMode
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Link
            component="button"
            onClick={toggleRegisterMode}
            sx={{ color: "#0056b3", textDecoration: "none" }}
          >
            {isRegisterMode ? "Sign In" : "Register Now"}
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
