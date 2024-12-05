import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Box, Typography, Button, Link, Paper } from "@mui/material";
import Logo from "../../assets/logo-main.png";
import { Google as GoogleIcon, Apple as AppleIcon } from "@mui/icons-material";
import { useAuth } from "../../utils/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithApple } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
      navigate("/dashboard");
    } catch (error) {
      console.error("Apple login error:", error);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xxl"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #84fab0, #8fd3f4)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "60%" }} />
        <Typography
          component="h1"
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 2 }}
        >
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          Sign in to your account
        </Typography>
        <Box>
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
          >
            Login with Google
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
          >
            Login with Apple
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mt: 3, fontSize: "0.85rem" }}
        >
          By logging in, you agree to our{" "}
          <Link
            component={RouterLink}
            to="/terms"
            sx={{ color: "#0056b3", textDecoration: "none" }}
          >
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link
            component={RouterLink}
            to="/privacy"
            sx={{ color: "#0056b3", textDecoration: "none" }}
          >
            Privacy Policy
          </Link>
          .
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
