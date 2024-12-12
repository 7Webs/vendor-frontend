import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../../api/apiwrapper';
import { toast } from 'react-toastify';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Card,
  CardMedia,
  Avatar,

} from '@mui/material';
import {
  CalendarToday,
  Store,
  Category,
  Email,
  ShoppingCart,
  Person,
} from '@mui/icons-material';
import AnimatedLoader from '../../components/loaders/AnimatedLoader';

const CouponDetails = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCouponDetails = async () => {
      try {
        const response = await apiService.get(`deals/${id}`);
        setCoupon(response.data);
      } catch (error) {
        toast.error('Error fetching coupon details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCouponDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <AnimatedLoader />
      </Box>
    );
  }

  if (!coupon) {
    return (
      <Box p={3}>
        <Typography variant="h5" color="error">
          Coupon not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Main Image Section */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={coupon.images[0] || 'https://via.placeholder.com/400'}
                alt={coupon.title}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {coupon.title}
            </Typography>

            

            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              {coupon.shortTagLine}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ mr: 1 }} />
              <Typography>
                Available until: {new Date(coupon.availableUntil).toLocaleDateString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip
                icon={<ShoppingCart />}
                label={`Max Purchase: ${coupon.maxPurchaseLimit}`}
                variant="outlined"
              />
              <Chip
                icon={<Person />}
                label={`Per User: ${coupon.maxPurchasePerUser}`}
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Typography paragraph>
              {coupon.features}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Keywords
            </Typography>
            <Box sx={{ mb: 2 }}>
              {coupon.keywords.split(',').map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword.trim()}
                  sx={{ m: 0.5 }}
                  size="small"
                />
              ))}
            </Box>
          </Grid>

          {/* Description Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {coupon.description}
            </Typography>
          </Grid>

          {/* Shop Information */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Shop Information
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    src={coupon.shop.logo}
                    alt={coupon.shop.name}
                    sx={{ width: 64, height: 64 }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6">{coupon.shop.name}</Typography>
                  <Typography color="text.secondary">{coupon.shop.description}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1 }} />
                  {coupon.shop.email}
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Store sx={{ mr: 1 }} />
                  {coupon.shop.address}
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  <Category sx={{ mr: 1 }} />
                  {coupon.shop.category.name}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CouponDetails;
