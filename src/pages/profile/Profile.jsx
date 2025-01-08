import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Stack,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  styled,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
  PhotoCamera as PhotoCameraIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useCategory } from "../../utils/contexts/CategoryContext";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const StyledInput = styled("input")({
  display: "none",
});

const Profile = () => {
  const { user } = useAuth();
  const { categories } = useCategory();
  const [isEditing, setIsEditing] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [shopData, setShopData] = useState({
    name: user.owen?.name || "",
    email: user.owen?.email || "",
    description: user.owen?.description || "",
    address: user.owen?.address || "",
    logo: user.owen?.logo || "",
    backgroundArt: user.owen?.backgroundArt || "",
  });
  const [tempShopData, setTempShopData] = useState({ ...shopData });
  const [previewUrls, setPreviewUrls] = useState({
    logo: user.owen?.logo || "",
    backgroundArt: user.owen?.backgroundArt || "",
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await apiService.get("subscriptions");
      setSubscriptions(response.data);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    }
  };

  const handleSubscriptionClick = (subscription) => {
    setSelectedSubscription(subscription);
    setOpenSubscriptionDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenSubscriptionDialog(false);
    setSelectedSubscription(null);
  };

  const handleChangePlan = async () => {
    try {
      const response = await apiService.get(
        `subscriptions/pay/${selectedSubscription.id}`
      );
      window.open(response.data, "_blank");
    } catch (error) {
      console.error("Error processing subscription payment:", error);
    }
    handleCloseDialog();
  };

  const handleCancelSubscription = () => {
    toast.info("This feature is coming soon!");
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleInputChange = (field) => (event) => {
    setTempShopData({
      ...tempShopData,
      [field]: event.target.value,
    });
  };

  const handleFileChange = (field) => async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a preview URL for the UI
      const previewUrl = URL.createObjectURL(file);
      console.log(field + " | " + previewUrl);
      setPreviewUrls((prev) => ({
        ...prev,
        [field]: previewUrl,
      }));

      // Update the tempShopData with the actual file
      setTempShopData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleStartEditing = () => {
    setTempShopData({ ...shopData });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset preview URLs to original values
    setPreviewUrls({
      logo: shopData.logo || "",
      backgroundArt: shopData.backgroundArt || "",
    });
    setTempShopData({ ...shopData });
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    try {
      // Create FormData instance
      const formData = new FormData();

      // Add only changed fields to FormData
      Object.keys(tempShopData).forEach((key) => {
        if (tempShopData[key] !== shopData[key]) {
          // If it's a File object, add it directly
          if (tempShopData[key] instanceof File) {
            formData.append(key, tempShopData[key]);
          } else {
            formData.append(key, tempShopData[key]);
          }
        }
      });

      // Add shop ID
      formData.append("id", user.owen.id);

      // Only send request if there are changes
      if (formData.entries().next().done === false) {
        const response = await apiService.post("shop", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Update the shop data with the response data
        setShopData((prev) => ({
          ...prev,
          ...response.data,
        }));

        // Update preview URLs with the new URLs from the response
        setPreviewUrls((prev) => ({
          ...prev,
          logo: response.data.logo || prev.logo,
          backgroundArt: response.data.backgroundArt || prev.backgroundArt,
        }));

        toast.success("Shop details updated successfully!");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating shop details:", error);
      toast.error("Failed to update shop details");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Shop Profile Card */}
      <Card sx={{ mb: 4, overflow: "visible" }}>
        {/* Banner Image */}
        <Box
          sx={{
            position: "relative",
            height: 200,
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5)), url(${previewUrls.backgroundArt})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {isEditing && (
            <Tooltip>
              <label htmlFor="banner-upload">
                <StyledInput
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange("backgroundArt")}
                />
                <IconButton
                  component="span"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                  }}
                >
                  <PhotoCameraIcon />
                </IconButton>
              </label>
            </Tooltip>
          )}
          <Box
            sx={{
              position: "absolute",
              top: 60,
              left: 0,
              right: 0,
              p: 3,
              color: "white",
              zIndex: 1,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleStartEditing}
              >
                Edit Shop
              </Button>
            )}
          </Box>
        </Box>

        {/* Logo and Basic Info */}
        <CardContent sx={{ position: "relative", pt: 0 }}>
          <Box
            sx={{
              display: "flex",
              marginTop: "-48px",
              marginBottom: 3,
              position: "relative",
              zIndex: 2,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={previewUrls.logo}
                alt={tempShopData.name}
                sx={{
                  width: 96,
                  height: 96,
                  border: "4px solid white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              {isEditing && (
                <Tooltip>
                  <label htmlFor="logo-upload">
                    <StyledInput
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange("logo")}
                    />
                    <IconButton
                      component="span"
                      sx={{
                        position: "absolute",
                        bottom: -8,
                        right: -8,
                        backgroundColor: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  </label>
                </Tooltip>
              )}
            </Box>
            <Box sx={{ ml: 2, mt: 2, flexGrow: 1 }}>
              {isEditing ? (
                <TextField
                  value={tempShopData.name}
                  onChange={handleInputChange("name")}
                  variant="standard"
                  fullWidth
                  sx={{ mb: 1 }}
                  placeholder="Shop Name"
                />
              ) : (
                <Typography variant="h5" gutterBottom>
                  {shopData.name}
                </Typography>
              )}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={user.owen?.subscriptionState}
                  color="primary"
                  size="small"
                  icon={<CheckCircleIcon />}
                />
                <Chip
                  label={getCategoryName(user.owen?.categoryId)}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Shop Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Shop Information
              </Typography>
              <Stack spacing={2}>
                {isEditing ? (
                  <>
                    <TextField
                      fullWidth
                      label="Email"
                      value={tempShopData.email}
                      onChange={handleInputChange("email")}
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      value={tempShopData.description}
                      onChange={handleInputChange("description")}
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="Address"
                      value={tempShopData.address}
                      onChange={handleInputChange("address")}
                      variant="outlined"
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="body1">
                      <strong>Email:</strong> {shopData.email}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {shopData.description}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Address:</strong> {shopData.address}
                    </Typography>
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Typography variant="body1">
                  <strong>Name:</strong> {user.name || "Not specified"}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Typography variant="body1">
                  <strong>Gender:</strong> {user.gender || "Not specified"}
                </Typography>
                <Typography variant="body1">
                  <strong>Birth Date:</strong>{" "}
                  {user.birthDate || "Not specified"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Available Plans Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Available Plans
      </Typography>
      <Grid container spacing={3}>
        {subscriptions.map((subscription) => (
          <Grid item xs={12} md={4} key={subscription.id}>
            <StyledCard
              sx={{
                background:
                  subscription.id === user.owen?.activeSubscriptionPlanId
                    ? "linear-gradient(135deg, #0288d1 0%, #26c6da 100%)"
                    : "white",
                color:
                  subscription.id === user.owen?.activeSubscriptionPlanId
                    ? "white"
                    : "inherit",
                "& .MuiTypography-root": {
                  color:
                    subscription.id === user.owen?.activeSubscriptionPlanId
                      ? "white"
                      : "inherit",
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {subscription.name}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  €{subscription.amount}
                  <Typography component="span" variant="body1">
                    /{subscription.interval}
                  </Typography>
                </Typography>
                <Divider
                  sx={{
                    my: 2,
                    borderColor:
                      subscription.id === user.owen?.activeSubscriptionPlanId
                        ? "white"
                        : "inherit",
                  }}
                />
                <Stack spacing={2}>
                  <Typography variant="body2">
                    {subscription.description}
                  </Typography>
                  <Typography variant="body2">
                    • Maximum Deals:{" "}
                    {subscription.maxDeals === 0
                      ? "Unlimited"
                      : subscription.maxDeals}
                  </Typography>
                </Stack>
              </CardContent>
              {subscription.id !== user.owen?.activeSubscriptionPlanId && (
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      color: "inherit",
                      borderColor: "inherit",
                    }}
                    onClick={() => handleSubscriptionClick(subscription)}
                  >
                    Change to This Plan
                  </Button>
                </CardActions>
              )}
              {subscription.id === user.owen?.activeSubscriptionPlanId && (
                <CardActions sx={{ p: 2, flexDirection: "column", gap: 1 }}>
                  <Chip
                    label="Current Plan"
                    sx={{
                      width: "100%",
                      backgroundColor: "white",
                      color: "#0288d1",
                    }}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                </CardActions>
              )}
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Subscription Change Dialog */}
      <Dialog
        open={openSubscriptionDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 0 }}>Change Subscription Plan</DialogTitle>
        <DialogContent>
          {selectedSubscription && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h5" gutterBottom color="primary">
                {selectedSubscription.name}
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                ${selectedSubscription.amount}
                <Typography component="span" variant="body1">
                  /{selectedSubscription.interval}
                </Typography>
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Typography variant="body1">
                  {selectedSubscription.description}
                </Typography>
                <Typography variant="body1">
                  • Maximum Deals:{" "}
                  {selectedSubscription.maxDeals === 0
                    ? "Unlimited"
                    : selectedSubscription.maxDeals}
                </Typography>
              </Stack>
              <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                Note: Changing your plan will take effect immediately.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangePlan}
            startIcon={<CreditCardIcon />}
          >
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
