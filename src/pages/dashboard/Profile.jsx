import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../utils/AuthContext';
import { apiService } from '../../api/apiwrapper';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await apiService.get('subscriptions');
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

  const handleChangePlan = () => {
    handleCloseDialog();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Combined Profile and Shop Card */}
      <Card sx={{ mb: 4, overflow: 'visible' }}>
        {/* Banner Image */}
        <Box
          sx={{
            position: 'relative',
            height: 200,
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${user.owen?.backgroundArt})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 3,
              color: 'white',
              zIndex: 1,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{ position: 'absolute', top: -160, right: 16 }}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Box>
        </Box>

        {/* Logo and Basic Info */}
        <CardContent sx={{ position: 'relative', pt: 0 }}>
          <Box sx={{
            display: 'flex',
            marginTop: '-48px',
            marginBottom: 3,
            position: 'relative',
            zIndex: 2
          }}>
            <Avatar
              src={user.owen?.logo}
              alt={user.owen?.name}
              sx={{
                width: 96,
                height: 96,
                border: '4px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: 'blue',
              }}
            />
            <Box sx={{ ml: 2, mt: 2 }}>
              {isEditing ? (
                <TextField
                  defaultValue={user.owen?.name}
                  variant="standard"
                  fullWidth
                  sx={{ mb: 1 }}
                  placeholder="Shop Name"
                />
              ) : (
                <Typography variant="h5" gutterBottom>
                  {user.owen?.name}
                </Typography>
              )}
              <Chip
                label={user.owen?.subscriptionState}
                color="primary"
                size="small"
                icon={<CheckCircleIcon />}
                sx={{ mr: 1 }}
              />
              <Chip
                label={user.owen?.category?.name}
                variant="outlined"
                size="small"
              />
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
                      label="Description"
                      defaultValue={user.owen?.description}
                      multiline
                      rows={2}
                    />
                    <TextField
                      fullWidth
                      label="Address"
                      defaultValue={user.owen?.address}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="body1">
                      {user.owen?.description}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Address:</strong> {user.owen?.address}
                    </Typography>
                  </>
                )}
              </Stack>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {isEditing ? (
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Name"
                        defaultValue={user.name}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        defaultValue={user.email}
                      />
                    </Stack>
                  ) : (
                    <Stack spacing={1}>
                      <Typography variant="body1">
                        <strong>Name:</strong> {user.name || 'Not specified'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Email:</strong> {user.email}
                      </Typography>
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {isEditing ? (
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Gender"
                        defaultValue={user.gender}
                      />
                      <TextField
                        fullWidth
                        label="Birth Date"
                        defaultValue={user.birthDate}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Stack>
                  ) : (
                    <Stack spacing={1}>
                      <Typography variant="body1">
                        <strong>Gender:</strong> {user.gender || 'Not specified'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Birth Date:</strong> {user.birthDate || 'Not specified'}
                      </Typography>
                    </Stack>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Current Subscription Plan */}
      {user.owen?.activeSubscriptionPlan && (
        <Grid item xs={12}>
          <StyledCard sx={{
            background: 'linear-gradient(135deg, #0288d1 0%, #26c6da 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            mb: 4
          }}>
            <CardContent>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <CreditCardIcon sx={{ fontSize: 32 }} />
                  <Typography variant="h5">Current Subscription Plan</Typography>
                </Stack>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h4" gutterBottom>
                      {user.owen.activeSubscriptionPlan.name}
                    </Typography>
                    <Typography variant="h3" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
                      ₹{user.owen.activeSubscriptionPlan.amount}
                      <Typography component="span" variant="h6">
                        /{user.owen.activeSubscriptionPlan.interval}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                      <Typography variant="body1">
                        <strong>Description:</strong> {user.owen.activeSubscriptionPlan.description}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Maximum Deals:</strong> {user.owen.activeSubscriptionPlan.maxDeals}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Trial Period:</strong> {user.owen.activeSubscriptionPlan.trialDays} days
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      )}

      {/* Available Plans Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Available Plans
      </Typography>
      <Grid container spacing={3}>
        {subscriptions.map((subscription) => (
          <Grid item xs={12} md={4} key={subscription.id}>
            <StyledCard sx={{
              backgroundColor: subscription.id === user.owen?.activeSubscriptionPlanId
                ? 'rgba(33, 150, 243, 0.1)'
                : 'white'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  {subscription.name}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  ₹{subscription.amount}
                  <Typography component="span" variant="body1">
                    /{subscription.interval}
                  </Typography>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    {subscription.description}
                  </Typography>
                  <Typography variant="body2">
                    • Maximum Deals: {subscription.maxDeals}
                  </Typography>
                  <Typography variant="body2">
                    • Trial Period: {subscription.trialDays} days
                  </Typography>
                </Stack>
              </CardContent>
              {subscription.id !== user.owen?.activeSubscriptionPlanId && (
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => handleSubscriptionClick(subscription)}
                  >
                    Change to This Plan
                  </Button>
                </CardActions>
              )}
              {subscription.id === user.owen?.activeSubscriptionPlanId && (
                <CardActions sx={{ p: 2 }}>
                  <Chip
                    label="Current Plan"
                    color="primary"
                    sx={{ width: '100%' }}
                  />
                </CardActions>
              )}
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Subscription Change Dialog */}
      <Dialog open={openSubscriptionDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 0 }}>
          Change Subscription Plan
        </DialogTitle>
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
                  • Maximum Deals: {selectedSubscription.maxDeals}
                </Typography>
                <Typography variant="body1">
                  • Trial Period: {selectedSubscription.trialDays} days
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
