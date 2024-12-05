import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

const mockProfile = {
  companyName: 'Tech Gadgets Inc.',
  email: 'contact@techgadgets.com',
  businessType: 'E-commerce',
  website: 'www.techgadgets.com',
  subscription: {
    plan: 'Professional',
    status: 'Active',
    nextBilling: '2023-09-01',
    price: '$79/month',
  },
  paymentMethod: {
    type: 'Credit Card',
    last4: '4242',
    expiry: '12/24',
  },
};

const Profile = () => {
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Company Profile Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Company Profile</Typography>
              <Button
                startIcon={isEditing ? null : <EditIcon />}
                onClick={() => !isEditing && setIsEditing(true)}
                variant={isEditing ? 'text' : 'outlined'}
              >
                {isEditing ? 'Editing...' : 'Edit Profile'}
              </Button>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Subscription and Payment Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscription Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Plan" secondary={profile.subscription.plan} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Status" secondary={profile.subscription.status} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Next Billing" secondary={profile.subscription.nextBilling} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Price" secondary={profile.subscription.price} />
                </ListItem>
              </List>
              <Button variant="outlined" fullWidth>
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCardIcon sx={{ mr: 1 }} />
                <Typography>
                  •••• {profile.paymentMethod.last4} (expires {profile.paymentMethod.expiry})
                </Typography>
              </Box>
              <Button variant="outlined" fullWidth>
                Update Payment Method
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  startIcon={<SecurityIcon />}
                  fullWidth
                >
                  Change Password
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  startIcon={<SecurityIcon />}
                  fullWidth
                >
                  Enable Two-Factor Authentication
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
