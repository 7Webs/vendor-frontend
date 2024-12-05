import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const steps = ["Account Details", "Business Information", "Subscription"];

const subscriptionTiers = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    features: ["Up to 100 coupons/month", "Basic Analytics", "Email Support"],
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    features: [
      "Unlimited coupons",
      "Advanced Analytics",
      "Priority Support",
      "API Access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    features: [
      "Unlimited coupons",
      "Custom Analytics",
      "24/7 Support",
      "API Access",
      "Custom Integration",
    ],
  },
];

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    businessType: "",
    website: "",
    selectedTier: "",
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeStep === steps.length - 1) {
      localStorage.setItem("token", "dummy-token");
      navigate("/");
    } else {
      handleNext();
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="companyName"
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="businessType-label">Business Type</InputLabel>
              <Select
                labelId="businessType-label"
                id="businessType"
                name="businessType"
                value={formData.businessType}
                label="Business Type"
                onChange={handleChange}
              >
                <MenuItem value="retail">Retail</MenuItem>
                <MenuItem value="ecommerce">E-commerce</MenuItem>
                <MenuItem value="service">Service</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              id="website"
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            {subscriptionTiers.map((tier) => (
              <Grid item xs={12} md={4} key={tier.id}>
                <Paper
                  elevation={formData.selectedTier === tier.id ? 8 : 1}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    border: formData.selectedTier === tier.id ? 2 : 0,
                    borderColor: "primary.main",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                  onClick={() =>
                    handleChange({
                      target: { name: "selectedTier", value: tier.id },
                    })
                  }
                >
                  <Typography variant="h6" component="h2">
                    {tier.name}
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ my: 2 }}>
                    ${tier.price}
                    <Typography variant="caption" component="span">
                      /month
                    </Typography>
                  </Typography>
                  <Box>
                    {tier.features.map((feature) => (
                      <Typography key={feature} variant="body2" sx={{ my: 1 }}>
                        • {feature}
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #84fab0, #8fd3f4)",
      }}
    >
      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Create your account
            </Typography>
            <Stepper activeStep={activeStep} sx={{ width: "100%", my: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 2 }}
                >
                  Back
                </Button>
                <Button type="submit" variant="contained">
                  {activeStep === steps.length - 1
                    ? "Complete Registration"
                    : "Next"}
                </Button>
              </Box>
              {activeStep === 0 && (
                <Box sx={{ mt: 2 }}>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Register;
