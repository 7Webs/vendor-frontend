import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { useAuth } from "../../utils/contexts/AuthContext";
import AnimatedLoader from "../../components/loaders/AnimatedLoader";
import { useCategory } from "../../utils/contexts/CategoryContext";
import { apiService } from "../../api/apiwrapper";
import LogoutIcon from '@mui/icons-material/Logout';

const RegisterShop = () => {
  const { user, authChecked, logout } = useAuth();

  const { categories, isLoading } = useCategory();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    address: "",
    approved: false,
    categoryId: "",
    logo: null,
    backgroundArt: null,
  });
  const [preview, setPreview] = useState({ logo: null, backgroundArt: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));

    // Preview the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("approved", formData.approved);
      formDataToSend.append("categoryId", formData.categoryId);

      // Append files
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      }
      if (formData.backgroundArt) {
        formDataToSend.append("backgroundArt", formData.backgroundArt);
      }

      await apiService.post("shop", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      window.location.reload();
    } catch (error) {
      console.error("Failed to register shop:", error);
    }
  };

  if (!authChecked || isLoading) {
    return <AnimatedLoader />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #001f7f40, #003cbf60)",
      }}
    >
      <IconButton
        onClick={logout}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: '#003cbf',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        <LogoutIcon />
      </IconButton>

      <Container
        component="main"
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          py: 6,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 4,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: 600,
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: 3,
              textAlign: "center",
              color: "#003cbf",
            }}
          >
            Register Your Shop
          </Typography>
          <Typography
            variant="body2"
            sx={{
              marginBottom: 3,
              textAlign: "center",
            }}
          >
            Welcome {user.name || "User"} to our platform! Please fill in your
            business details for us to review.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Shop Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ background: "#ffffff", borderRadius: 1 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ background: "#ffffff", borderRadius: 1 }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              sx={{ background: "#ffffff", borderRadius: 1 }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="address"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              sx={{ background: "#ffffff", borderRadius: 1 }}
            />
            <TextField
              margin="normal"
              required
              select
              fullWidth
              id="categoryId"
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              sx={{ background: "#ffffff", borderRadius: 1 }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1, color: "#003cbf" }}>
                  Upload Logo
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mb: 1, backgroundColor: "#003cbf", color: "#ffffff" }}
                >
                  Choose File
                  <input
                    type="file"
                    name="logo"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {preview.logo && (
                  <Box
                    component="img"
                    src={preview.logo}
                    alt="Logo Preview"
                    sx={{ width: "100%", borderRadius: 2, mt: 1 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1, color: "#003cbf" }}>
                  Upload Background Art
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mb: 1, backgroundColor: "#003cbf", color: "#ffffff" }}
                >
                  Choose File
                  <input
                    type="file"
                    name="backgroundArt"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {preview.backgroundArt && (
                  <Box
                    component="img"
                    src={preview.backgroundArt}
                    alt="Background Art Preview"
                    sx={{ width: "100%", borderRadius: 2, mt: 1 }}
                  />
                )}
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#003cbf",
                color: "white",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#002a8f" },
              }}
            >
              Register Shop
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default RegisterShop;
