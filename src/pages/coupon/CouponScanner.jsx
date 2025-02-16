import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Container,
  Paper,
  Fade,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Link,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import {
  QrCode as QrCodeIcon,
  ArrowBack as ArrowBackIcon,
  TextFields as TextFieldsIcon,
  Close as CloseIcon,
  Store,
  Category,
  CalendarToday,
  Person,
  Phone,
  Email,
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  LinkedIn,
} from "@mui/icons-material";
import { FaTiktok as TikTokIcon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import QrScanner from "../../components/QR/QrScanner";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";

const CouponScanner = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [couponDetails, setCouponDetails] = useState(null);

  const handleScanQR = () => {
    setShowScanner(true);
    setShowManualEntry(false);
    setIsScanning(true);
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
    setShowScanner(false);
  };

  const handleScanApi = async (code) => {
    try {
      const response = await apiService.get(`deals-redeem/coupon/${code}`);
      if (response.data) {
        setCouponDetails(response.data);
        setDialogOpen(true);
      }
    } catch (error) {
      toast.error("Invalid or expired coupon code");
      console.error("Invalid or expired coupon code", error);
    }
  };

  const handleApproveCoupon = async () => {
    try {
      await apiService.patch(`deals-redeem/use/${couponDetails.couponCode}`);
      setDialogOpen(false);
      toast.success("Coupon redeemed successfully");
      navigate(`/redeemed-coupons`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to redeem coupon");
      console.error("Failed to redeem coupon", error);
    }
  };

  const handleManualSubmit = async () => {
    await handleScanApi(manualCode);
    setManualCode("");
    setShowManualEntry(false);
  };

  const handleQRScan = async (code) => {
    if (code && isScanning) {
      setIsScanning(false);
      await handleScanApi(code);
      setShowScanner(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper elevation={3} sx={{ width: "100%", p: 4, borderRadius: 3 }}>
        <Box sx={{ position: "relative" }}>
          {(showManualEntry || showScanner) && (
            <IconButton
              sx={{ position: "absolute", left: -12, top: -12 }}
              onClick={() => {
                setShowManualEntry(false);
                setShowScanner(false);
                setIsScanning(false);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 700 }}
          >
            Redeem Coupon
          </Typography>

          {!showManualEntry && !showScanner && (
            <Fade in timeout={500}>
              <Stack spacing={3} sx={{ mt: 6 }}>
                <Button
                  variant="contained"
                  startIcon={<QrCodeIcon />}
                  onClick={handleScanQR}
                  fullWidth
                  size="large"
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Scan QR Code
                </Button>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <Button
                  variant="outlined"
                  startIcon={<TextFieldsIcon />}
                  onClick={handleManualEntry}
                  fullWidth
                  size="large"
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    borderWidth: 2,
                    transition: "transform 0.2s",
                    "&:hover": {
                      borderWidth: 2,
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Enter Code Manually
                </Button>
              </Stack>
            </Fade>
          )}

          {showManualEntry && (
            <Fade in timeout={500}>
              <Box sx={{ mt: 4 }}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Enter Coupon Code"
                  fullWidth
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleManualSubmit}
                    disabled={!manualCode}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}

          {showScanner && (
            <Fade in timeout={500}>
              <Box sx={{ mt: 4 }}>
                <QrScanner
                  onScan={handleQRScan}
                  onBack={() => {
                    setShowScanner(false);
                    setIsScanning(false);
                  }}
                />
              </Box>
            </Fade>
          )}

          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                backgroundImage:
                  "linear-gradient(to bottom right, #ffffff, #f8f9fa)",
              },
            }}
          >
            <DialogTitle
              sx={{
                m: 0,
                p: 3,
                background: alpha(theme.palette.primary.main, 0.05),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                Coupon Details
              </Typography>
              <IconButton
                onClick={() => setDialogOpen(false)}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              {couponDetails && (
                <Stack spacing={3}>
                  <Card
                    elevation={0}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 3 }}
                      >
                        <Avatar
                          src={couponDetails.deal.images?.[0]}
                          sx={{
                            width: 80,
                            height: 80,
                            boxShadow: theme.shadows[2],
                          }}
                          variant="rounded"
                        />
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {couponDetails.deal.title}
                          </Typography>
                          <Chip
                            label={couponDetails.couponCode}
                            color="primary"
                            sx={{
                              borderRadius: 1.5,
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Deal Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <Store sx={{ color: theme.palette.primary.main }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Shop
                          </Typography>
                          <Typography variant="body1">
                            {couponDetails.deal.shop.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <Category
                            sx={{ color: theme.palette.primary.main }}
                          />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Category
                          </Typography>
                          <Typography variant="body1">
                            {couponDetails.deal.shop.category.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <CalendarToday
                            sx={{ color: theme.palette.primary.main }}
                          />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Valid Until
                          </Typography>
                          <Typography variant="body1">
                            {new Date(
                              couponDetails.deal.availableUntil
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <Store sx={{ color: theme.palette.primary.main }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Discount
                          </Typography>
                          <Typography variant="body1">
                            {couponDetails.deal.percentOff > 0
                              ? `${couponDetails.deal.percentOff}% off`
                              : `$${couponDetails.deal.uptoAmount} off`}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <Store sx={{ color: theme.palette.primary.main }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Spend Limits
                          </Typography>
                          <Typography variant="body1">
                            Min: ${couponDetails.deal.minSpend} | Max: $
                            {couponDetails.deal.maxSpend || "No limit"}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Customer Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}
                        >
                          <Person sx={{ color: theme.palette.info.main }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Name
                          </Typography>
                          <Typography variant="body1">
                            {couponDetails.user.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}
                        >
                          <Phone sx={{ color: theme.palette.info.main }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Phone
                          </Typography>
                          <Typography variant="body1">
                            {couponDetails.user.phone}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}
                        >
                          <Email sx={{ color: theme.palette.info.main }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {couponDetails.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Social Media
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {couponDetails.user.facebookProfileLink && (
                        <IconButton
                          component={Link}
                          href={couponDetails.user.facebookProfileLink}
                          target="_blank"
                          sx={{
                            color: "#1877F2",
                            bgcolor: alpha("#1877F2", 0.1),
                            "&:hover": {
                              bgcolor: alpha("#1877F2", 0.2),
                            },
                          }}
                        >
                          <Facebook />
                        </IconButton>
                      )}
                      {couponDetails.user.instagramProfileLink && (
                        <IconButton
                          component={Link}
                          href={couponDetails.user.instagramProfileLink}
                          target="_blank"
                          sx={{
                            color: "#E4405F",
                            bgcolor: alpha("#E4405F", 0.1),
                            "&:hover": {
                              bgcolor: alpha("#E4405F", 0.2),
                            },
                          }}
                        >
                          <Instagram />
                        </IconButton>
                      )}
                      {couponDetails.user.twitterProfileLink && (
                        <IconButton
                          component={Link}
                          href={couponDetails.user.twitterProfileLink}
                          target="_blank"
                          sx={{
                            color: "#1DA1F2",
                            bgcolor: alpha("#1DA1F2", 0.1),
                            "&:hover": {
                              bgcolor: alpha("#1DA1F2", 0.2),
                            },
                          }}
                        >
                          <Twitter />
                        </IconButton>
                      )}
                      {couponDetails.user.youtubeProfileLink && (
                        <IconButton
                          component={Link}
                          href={couponDetails.user.youtubeProfileLink}
                          target="_blank"
                          sx={{
                            color: "#FF0000",
                            bgcolor: alpha("#FF0000", 0.1),
                            "&:hover": {
                              bgcolor: alpha("#FF0000", 0.2),
                            },
                          }}
                        >
                          <YouTube />
                        </IconButton>
                      )}
                      {couponDetails.user.linkedinProfileLink && (
                        <IconButton
                          component={Link}
                          href={couponDetails.user.linkedinProfileLink}
                          target="_blank"
                          sx={{
                            color: "#0A66C2",
                            bgcolor: alpha("#0A66C2", 0.1),
                            "&:hover": {
                              bgcolor: alpha("#0A66C2", 0.2),
                            },
                          }}
                        >
                          <LinkedIn />
                        </IconButton>
                      )}
                      {couponDetails.user.tiktokProfileLink && (
                        <IconButton
                          component={Link}
                          href={couponDetails.user.tiktokProfileLink}
                          target="_blank"
                          sx={{
                            color: "#000000",
                            bgcolor: alpha("#000000", 0.1),
                            "&:hover": {
                              bgcolor: alpha("#000000", 0.2),
                            },
                          }}
                        >
                          <TikTokIcon size={24} />
                        </IconButton>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              )}
            </DialogContent>
            <DialogActions
              sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}
            >
              <Button
                variant="contained"
                onClick={handleApproveCoupon}
                fullWidth
                size="large"
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  boxShadow: theme.shadows[8],
                  "&:hover": {
                    boxShadow: theme.shadows[12],
                  },
                }}
              >
                Approve Redemption
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default CouponScanner;
