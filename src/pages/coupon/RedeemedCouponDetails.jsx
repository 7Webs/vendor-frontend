import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Avatar,
  Stack,
  Divider,
  Link,
  CircularProgress,
  useTheme,
  alpha,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Tooltip,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as PendingIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material";
import { FaTiktok as TikTokIcon } from "react-icons/fa";
import { format } from "date-fns";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";
import { getStatusConfig } from "../../utils/Status";

const SocialMediaLink = ({ href, icon: Icon, color, title }) => {
  const theme = useTheme();

  if (!href) return null;

  return (
    <Tooltip title={title}>
      <IconButton
        component={Link}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: color,
          "&:hover": { transform: "scale(1.1)" },
        }}
      >
        <Icon />
      </IconButton>
    </Tooltip>
  );
};

const RedeemedCouponDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const [redemption, setRedemption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRedemption = async () => {
      try {
        const response = await apiService.get(`deals-redeem/${id}`);
        setRedemption(response.data);
      } catch (error) {
        console.error("Error fetching redemption details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRedemption();
  }, [id]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(redemption.couponCode);
    toast.success("Coupon code copied to clipboard!");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!redemption) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Failed to load redemption details
        </Typography>
      </Box>
    );
  }

  const statusConfig = getStatusConfig(theme, redemption.status);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.background.paper,
            0.9
          )}, ${alpha(theme.palette.background.paper, 0.95)})`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Grid container>
          <Grid item xs={12} md={2.1}>
            <CardMedia
              component="img"
              image={redemption.deal.images?.[0]}
              alt={redemption.deal.title}
              sx={{
                height: "100%",
                minHeight: 100,
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      component="h1"
                      fontWeight="800"
                      sx={{
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {redemption.deal.title}
                    </Typography>
                    <Chip
                      icon={statusConfig.icon}
                      label={statusConfig.label}
                      sx={{
                        color: statusConfig.color,
                        borderColor: statusConfig.color,
                        bgcolor: alpha(statusConfig.color, 0.1),
                        borderRadius: "12px",
                      }}
                    />
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.8),
                    lineHeight: 1.8,
                  }}
                >
                  {redemption.deal.description}
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip
                    icon={<CategoryIcon />}
                    label={redemption.deal.category?.name}
                    variant="outlined"
                    sx={{ borderRadius: "12px" }}
                  />
                  <Chip
                    icon={<CalendarIcon />}
                    label={`Valid until: ${format(
                      new Date(redemption.deal.availableUntil),
                      "PP"
                    )}`}
                    variant="outlined"
                    sx={{ borderRadius: "12px" }}
                  />
                  <Chip
                    icon={
                      redemption.used ? <CheckCircleIcon /> : <PendingIcon />
                    }
                    label={redemption.used ? "Used" : "Not Used Yet"}
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: redemption.used
                        ? alpha(theme.palette.success.main, 0.1)
                        : alpha(theme.palette.warning.main, 0.1),
                      color: redemption.used
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                      border: `1px solid ${
                        redemption.used
                          ? theme.palette.success.main
                          : theme.palette.warning.main
                      }`,
                      fontWeight: 600,
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, opacity: 0.1 }} />

        <Grid container spacing={4} sx={{ p: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="700"
              sx={{
                color: theme.palette.primary.main,
                mb: 3,
              }}
            >
              Customer Details
            </Typography>
            <Card
              elevation={0}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <CardContent>
                <Stack spacing={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={redemption.user.photo}
                      alt={redemption.user.name}
                      sx={{
                        width: 64,
                        height: 64,
                        border: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="700">
                        {redemption.user.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha(theme.palette.text.primary, 0.6),
                          textTransform: "capitalize",
                        }}
                      >
                        {redemption.user.gender}
                      </Typography>
                    </Box>
                  </Box>

                  {redemption.user.phone && (
                    <Button
                      startIcon={<PhoneIcon />}
                      variant="text"
                      href={`tel:${redemption.user.phone}`}
                      sx={{ justifyContent: "flex-start" }}
                    >
                      {redemption.user.phone}
                    </Button>
                  )}

                  <Button
                    startIcon={<EmailIcon />}
                    variant="text"
                    href={`mailto:${redemption.user.email}`}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {redemption.user.email}
                  </Button>

                  <Stack direction="row" spacing={2}>
                    <SocialMediaLink
                      href={redemption.user.facebookProfileLink}
                      icon={FacebookIcon}
                      color="#1877F2"
                      title="Facebook Profile"
                    />
                    <SocialMediaLink
                      href={redemption.user.instagramProfileLink}
                      icon={InstagramIcon}
                      color="#E4405F"
                      title="Instagram Profile"
                    />
                    <SocialMediaLink
                      href={redemption.user.twitterProfileLink}
                      icon={TwitterIcon}
                      color="#1DA1F2"
                      title="Twitter Profile"
                    />
                    <SocialMediaLink
                      href={redemption.user.youtubeProfileLink}
                      icon={YouTubeIcon}
                      color="#FF0000"
                      title="YouTube Channel"
                    />
                    <SocialMediaLink
                      href={redemption.user.linkedinProfileLink}
                      icon={LinkedInIcon}
                      color="#0A66C2"
                      title="LinkedIn Profile"
                    />
                    <SocialMediaLink
                      href={redemption.user.tiktokProfileLink}
                      icon={TikTokIcon}
                      color="#000000"
                      title="TikTok Profile"
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="700"
              sx={{
                color: theme.palette.primary.main,
                mb: 3,
              }}
            >
              Additional Information
            </Typography>
            <Card
              elevation={0}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <CardContent>
                <Stack spacing={3}>
                  {/* Additional Information */}
                  {redemption.additionalInfo ? (
                    <Typography
                      variant="body1"
                      sx={{
                        color: alpha(theme.palette.text.primary, 0.8),
                        lineHeight: 1.8,
                      }}
                    >
                      {redemption.additionalInfo}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha(theme.palette.text.primary, 0.5),
                        fontStyle: "italic",
                      }}
                    >
                      No additional information provided
                    </Typography>
                  )}

                  {/* Social Media Link */}
                  {redemption.socialMediaLink && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        fontWeight="600"
                      >
                        Social Media Post
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<LaunchIcon />}
                        href={redemption.socialMediaLink}
                        target="_blank"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                        }}
                      >
                        View Post
                      </Button>
                    </Box>
                  )}

                  {/* Uploaded Images */}
                  {redemption.image && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        fontWeight="600"
                      >
                        Attached Images
                      </Typography>
                      <ImageList cols={3} gap={8}>
                        {redemption.image.map((image, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={image}
                              alt={`Image ${index}`}
                              loading="lazy"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}

                  {/* Engagement Metrics */}
                  {(redemption.totalViews ||
                    redemption.totalLikes ||
                    redemption.totalComments) && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        fontWeight="600"
                      >
                        Engagement Metrics
                      </Typography>
                      <Stack direction="row" spacing={4}>
                        {redemption.totalViews !== undefined && (
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: alpha(theme.palette.text.primary, 0.8),
                              }}
                            >
                              Total Views
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: alpha(theme.palette.text.primary, 0.7),
                              }}
                            >
                              {redemption.totalViews}
                            </Typography>
                          </Box>
                        )}
                        {redemption.totalLikes !== undefined && (
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: alpha(theme.palette.text.primary, 0.8),
                              }}
                            >
                              Total Likes
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: alpha(theme.palette.text.primary, 0.7),
                              }}
                            >
                              {redemption.totalLikes}
                            </Typography>
                          </Box>
                        )}
                        {redemption.totalComments !== undefined && (
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: alpha(theme.palette.text.primary, 0.8),
                              }}
                            >
                              Total Comments
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: alpha(theme.palette.text.primary, 0.7),
                              }}
                            >
                              {redemption.totalComments}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default RedeemedCouponDetails;
